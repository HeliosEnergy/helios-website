FROM ubuntu:22.04

# Add ARG at the top to receive build-time variable
ARG POSTGRES_PASSWORD

# Pre-configure timezone to avoid interactive prompt
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=UTC

RUN apt-get update
RUN apt-get install -y \
    gnupg \
    postgresql-common \
    apt-transport-https \
    lsb-release \
    wget \
    ca-certificates \
    curl \
    tzdata

# Set timezone
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Add PostgreSQL repository and key properly
RUN curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /usr/share/keyrings/postgresql-keyring.gpg
RUN echo "deb [signed-by=/usr/share/keyrings/postgresql-keyring.gpg] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list

# Add TimescaleDB repository and key properly
RUN curl -fsSL https://packagecloud.io/timescale/timescaledb/gpgkey | gpg --dearmor -o /usr/share/keyrings/timescaledb-keyring.gpg
RUN echo "deb [signed-by=/usr/share/keyrings/timescaledb-keyring.gpg] https://packagecloud.io/timescale/timescaledb/ubuntu $(lsb_release -cs) main" > /etc/apt/sources.list.d/timescaledb.list

RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y \
    postgresql-17 \
    postgresql-server-dev-17 \
    postgresql-17-postgis-3 \
    postgresql-17-postgis-3-scripts \
    timescaledb-2-postgresql-17 \
    postgis \
    postgresql-17-pgvector

# Run timescaledb-tune non-interactively
RUN yes | timescaledb-tune

# Configure PostgreSQL to accept remote connections
RUN echo "host all all 0.0.0.0/0 md5" >> /etc/postgresql/17/main/pg_hba.conf && \
    echo "listen_addresses='*'" >> /etc/postgresql/17/main/postgresql.conf && \
    echo "local all all trust" >> /etc/postgresql/17/main/pg_hba.conf

EXPOSE 5432

ADD start.sh /start.sh

CMD bash start.sh