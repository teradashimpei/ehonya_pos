import bcrypt
from datetime import date, datetime

from app.database import SessionLocal
from app.models import TaxRate, User, Member, Product

db = SessionLocal()

# 税率
tax = TaxRate(rate=0.10, effective_from=date(2019, 10, 1))
db.add(tax)

# 担当者
users = [
    {"employee_id": "S001", "password": "pass1234", "name": "やまだ"},
    {"employee_id": "S002", "password": "pass5678", "name": "すずき"},
]

for u in users:
    hashed = bcrypt.hashpw(u["password"].encode(), bcrypt.gensalt())
    user = User(
        employee_id=u["employee_id"],
        password_hash=hashed.decode(),
        name=u["name"],
        created_at=datetime.now(),
    )
    db.add(user)

# 会員
members = [
    {"member_id": "000001", "name": "たなか"},
]

for m in members:
    member = Member(member_id=m["member_id"], name=m["name"])
    db.add(member)

# 商品
products = [
    {"product_code": "9784001234567", "name": "ぞうのはな", "unit_price": 1200},
    {"product_code": "9784007654321", "name": "きょうりゅうずかん", "unit_price": 1500},
    {"product_code": "9784003330000", "name": "ちいさなえほん", "unit_price": 333},
    {"product_code": "9784009999999", "name": "えほん全集", "unit_price": 100000},
]

for p in products:
    product = Product(
        product_code=p["product_code"],
        name=p["name"],
        unit_price=p["unit_price"],
    )
    db.add(product)

db.commit()
db.close()

print("テストデータを投入しました")