"""empty message

Revision ID: 58b2977733c6
Revises: 
Create Date: 2020-01-16 20:12:21.070467

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '58b2977733c6'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('reports',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date', sa.Date(), nullable=False),
    sa.Column('start_time', sa.Time(), nullable=False),
    sa.Column('end_time', sa.Time(), nullable=False),
    sa.Column('location', sa.String(length=100), nullable=False),
    sa.Column('male_organizers', sa.Integer(), nullable=False),
    sa.Column('female_organizers', sa.Integer(), nullable=False),
    sa.Column('other_organizers', sa.Integer(), nullable=False),
    sa.Column('male_attendees', sa.Integer(), nullable=False),
    sa.Column('female_attendees', sa.Integer(), nullable=False),
    sa.Column('other_attendees', sa.Integer(), nullable=False),
    sa.Column('male_new_attendees', sa.Integer(), nullable=False),
    sa.Column('female_new_attendees', sa.Integer(), nullable=False),
    sa.Column('other_new_attendees', sa.Integer(), nullable=False),
    sa.Column('topics', sa.String(length=200), nullable=False),
    sa.Column('important_notes', sa.String(length=1000), nullable=True),
    sa.Column('report_saved', sa.Date(), nullable=False),
    sa.Column('report_created', sa.Date(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('reports')
    # ### end Alembic commands ###
