from sqlalchemy import Column, Integer, DECIMAL, Date, String, DateTime, ForeignKey
from app.database import Base

class TaxRate(Base):
    __tablename__ = "tax_rates"

    id = Column(Integer, primary_key=True, autoincrement=True)
    rate = Column(DECIMAL(4, 3), nullable=False)
    effective_from = Column(Date, nullable=False)

class Product(Base):
    __tablename__ = "products"

    product_code = Column(String(20), primary_key=True)
    name = Column(String(255), nullable=False)
    unit_price = Column(DECIMAL(10, 2), nullable=False)

class Member(Base):
    __tablename__ = "members"

    member_id = Column(String(20), primary_key=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    address = Column(String(255), nullable=True)
    gender = Column(String(10), nullable=True)
    age = Column(Integer, nullable=True)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(String(20), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    created_at = Column(DateTime, nullable=False)

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    member_id = Column(String(20), ForeignKey("members.member_id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_with_tax = Column(DECIMAL(10, 2), nullable=False)
    total_without_tax = Column(DECIMAL(10, 2), nullable=False)
    created_at = Column(DateTime, nullable=False)

class TransactionItem(Base):
    __tablename__ = "transaction_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    transaction_id = Column(Integer, ForeignKey("transactions.id"), nullable=False)
    product_code = Column(String(20), ForeignKey("products.product_code"), nullable=False)
    unit_price = Column(DECIMAL(10, 2), nullable=False)