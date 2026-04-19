from app.db.database import Base, engine
from app.models.user import User
from app.models.chat import Chat

Base.metadata.create_all(bind=engine)

print("Tables created")
