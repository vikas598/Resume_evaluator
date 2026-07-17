# init_db.py

from app.database import Base, engine
import app.models

Base.metadata.create_all(engine)