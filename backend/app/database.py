import os
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./lumina.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def sync_schema(metadata) -> None:
    """Best-effort schema sync for missing columns when no migrations are configured."""
    inspector = inspect(engine)
    preparer = engine.dialect.identifier_preparer

    with engine.begin() as connection:
        existing_tables = set(inspector.get_table_names())

        for table in metadata.sorted_tables:
            if table.name not in existing_tables:
                continue

            existing_columns = {
                column_info["name"] for column_info in inspector.get_columns(table.name)
            }

            for column in table.columns:
                if column.name in existing_columns:
                    continue

                table_name = preparer.quote(table.name)
                column_name = preparer.quote(column.name)
                column_type = column.type.compile(dialect=engine.dialect)

                # Add newly discovered columns in a nullable form so older databases
                # with existing rows can be repaired without destructive rewrites.
                connection.execute(
                    text(
                        f"ALTER TABLE {table_name} "
                        f"ADD COLUMN {column_name} {column_type}"
                    )
                )

        metadata.create_all(bind=connection)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
