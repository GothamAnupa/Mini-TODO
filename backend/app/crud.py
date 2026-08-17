from sqlalchemy.orm import Session

from app import models, schemas


def create_task(db: Session, task: schemas.TaskCreate):
    new_task = models.Task(
        title=task.title,
        description=task.description,
        due_date=task.due_date
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task



def get_tasks(db: Session):
    return (
        db.query(models.Task)
        .order_by(models.Task.due_date.asc())
        .all()
    )

from datetime import datetime, timedelta


def get_upcoming_tasks(db: Session):
    now = datetime.now()
    next_24_hours = now + timedelta(hours=24)

    return (
        db.query(models.Task)
        .filter(
            models.Task.due_date >= now,
            models.Task.due_date <= next_24_hours,
            models.Task.completed == False
        )
        .order_by(models.Task.due_date.asc())
        .all()
    )


def update_task(db: Session, task_id: int, task_data: schemas.TaskUpdate):

    task = (
        db.query(models.Task)
        .filter(models.Task.id == task_id)
        .first()
    )

    if task is None:
        return None

    if task_data.title is not None:
        task.title = task_data.title

    if task_data.description is not None:
        task.description = task_data.description

    if task_data.due_date is not None:
        task.due_date = task_data.due_date

    if task_data.completed is not None:
        task.completed = task_data.completed

    db.commit()
    db.refresh(task)

    return task
    task = db.query(models.Task).filter(models.Task.id == task_id).first()

    if task is None:
        return None

    task.completed = completed

    db.commit()
    db.refresh(task)

    return task


def delete_task(db: Session, task_id: int):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()

    if task is None:
        return None

    db.delete(task)
    db.commit()

    return task








