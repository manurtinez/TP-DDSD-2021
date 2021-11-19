FROM python:3
ENV PYTHONUNBUFFERED 1
WORKDIR /code
RUN apt update && apt install python3-dev libpq-dev -y
COPY requirements.txt /code/
RUN pip install -r requirements.txt
COPY . /code/