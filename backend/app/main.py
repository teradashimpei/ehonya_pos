import os
from datetime import date, datetime

import bcrypt
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from starlette.middleware.sessions import SessionMiddleware

from app.database import get_db
from app.models import Member, Product, TaxRate, Transaction, TransactionItem, User


class TransactionRequest(BaseModel):
    member_id: str | None = None
    product_codes: list[str]


app = FastAPI()

app.add_middleware(SessionMiddleware, secret_key=os.getenv("SESSION_SECRET", "dev-secret"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


def require_login(request: Request):
    """セッションにuser_idが入っているか確認する。無ければ401。"""
    user_id = request.session.get("user_id")
    if user_id is None:
        raise HTTPException(status_code=401, detail="ログインしてください")
    return user_id


@app.get("/")
def read_root():
    return {"message": "こんにちは"}


@app.get("/api/tax-rate")
def get_tax_rate(db: Session = Depends(get_db), user_id: int = Depends(require_login)):
    tax = (
        db.query(TaxRate)
        .filter(TaxRate.effective_from <= date.today())
        .order_by(TaxRate.effective_from.desc())
        .first()
    )
    return {"rate": float(tax.rate), "effective_from": str(tax.effective_from)}


@app.get("/api/products/{product_code}")
def get_product(product_code: str, db: Session = Depends(get_db), user_id: int = Depends(require_login)):
    if not product_code.isdigit() or len(product_code) != 13:
        raise HTTPException(status_code=400, detail="商品コードは13桁の数字で入力してください")

    product = db.query(Product).filter(Product.product_code == product_code).first()
    if product is None:
        raise HTTPException(status_code=404, detail="商品がマスタ未登録です")

    return {
        "product_code": product.product_code,
        "name": product.name,
        "unit_price": float(product.unit_price),
    }


@app.get("/api/members/{member_id}")
def get_member(member_id: str, db: Session = Depends(get_db), user_id: int = Depends(require_login)):
    if not member_id.isdigit() or len(member_id) != 6:
        raise HTTPException(status_code=400, detail="会員IDは6桁の数字で入力してください")

    member = db.query(Member).filter(Member.member_id == member_id).first()
    if member is None:
        raise HTTPException(status_code=404, detail="会員が見つかりません")

    return {"member_id": member.member_id, "name": member.name}


@app.post("/api/login")
def login(request: Request, employee_id: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.employee_id == employee_id).first()

    if user is None or not bcrypt.checkpw(password.encode(), user.password_hash.encode()):
        raise HTTPException(status_code=401, detail="IDまたはパスワードが違います")

    request.session["user_id"] = user.id
    return {"user_id": user.id, "name": user.name}


@app.post("/api/logout")
def logout(request: Request):
    request.session.clear()
    return {"message": "ログアウトしました"}


@app.post("/api/transactions")
def create_transaction(
    body: TransactionRequest,
    db: Session = Depends(get_db),
    user_id: int = Depends(require_login),
):
    member_id = body.member_id
    product_codes = body.product_codes

    if len(product_codes) == 0:
        raise HTTPException(status_code=400, detail="購入リストが空です")
    if len(product_codes) > 50:
        raise HTTPException(status_code=400, detail="1回の会計で登録できるのは50冊までです")

    products = []
    for code in product_codes:
        product = db.query(Product).filter(Product.product_code == code).first()
        if product is None:
            raise HTTPException(status_code=404, detail=f"商品がマスタ未登録です: {code}")
        products.append(product)

    tax = (
        db.query(TaxRate)
        .filter(TaxRate.effective_from <= date.today())
        .order_by(TaxRate.effective_from.desc())
        .first()
    )

    total_without_tax = sum(p.unit_price for p in products)
    total_with_tax = int(float(total_without_tax) * (1 + float(tax.rate)))
    
    try:
        transaction = Transaction(
            member_id=member_id,
            user_id=user_id,
            total_with_tax=total_with_tax,
            total_without_tax=total_without_tax,
            created_at=datetime.now(),
        )
        db.add(transaction)
        db.flush()

        for product in products:
            item = TransactionItem(
                transaction_id=transaction.id,
                product_code=product.product_code,
                unit_price=product.unit_price,
            )
            db.add(item)

        db.commit()
    except Exception as e:
        db.rollback()
        print(f"エラー詳細: {e}")
        raise HTTPException(status_code=500, detail="購入の登録に失敗しました")

    return {
        "transaction_id": transaction.id,
        "total_with_tax": float(total_with_tax),
        "total_without_tax": float(total_without_tax),
        "created_at": str(transaction.created_at),
    }