"""add_password_hash_to_users

Revision ID: 098f8858ee4e
Revises: 974cd85fc5f5
Create Date: 2026-01-06 19:27:28.982287

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '098f8858ee4e'
down_revision = '974cd85fc5f5'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # password_hash is now included in initial migration
    # This migration is kept for version history but does nothing
    pass


def downgrade() -> None:
    # No-op - password_hash is now in initial migration
    pass
