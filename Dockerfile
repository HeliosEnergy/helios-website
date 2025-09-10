# Stage 1: Base system with core dependencies
FROM ubuntu:22.04 as base
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    wget \
    curl \
    git \
    cron \
    nodejs \
    npm \
    nginx \
    jq \
    sudo \
    # Dependencies for puppeteer
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Stage 2: Conda installation
FROM base as conda
ENV CONDA_DIR /opt/conda

RUN wget --quiet https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-aarch64.sh -O ~/miniconda.sh && \
    /bin/bash ~/miniconda.sh -b -p $CONDA_DIR && \
    rm ~/miniconda.sh

ENV PATH=$CONDA_DIR/bin:$PATH


# Create a conda environment with Python 3.10
RUN conda config --set auto_update_conda false && \
    conda tos accept --override-channels --channel https://repo.anaconda.com/pkgs/main && \
    conda tos accept --override-channels --channel https://repo.anaconda.com/pkgs/r
RUN conda create -n myenv python=3.10 -y
ENV PATH=$CONDA_DIR/envs/myenv/bin:$PATH

# Stage 3: Final image with project setup
FROM conda as final

# Accept build arguments
ARG APP_USER=developer
ARG APP_USER_PASSWORD=developer123

# Create and set working directory
WORKDIR /workspace

# Initialize CRON
RUN service cron start

# Set the default shell to bash
SHELL ["/bin/bash", "-c"]

# Activate conda environment by default
RUN echo "conda activate myenv" >> ~/.bashrc

# Create a non-root user with sudo privileges
RUN useradd -m -s /bin/bash ${APP_USER} && \
    echo "${APP_USER}:${APP_USER_PASSWORD}" | chpasswd && \
    echo "${APP_USER} ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/${APP_USER} && \
    chown -R ${APP_USER}:${APP_USER} /workspace && \
    chown -R ${APP_USER}:${APP_USER} $CONDA_DIR

# Switch to the non-root user
USER ${APP_USER}

# Command to keep container running
CMD ["/opt/conda/envs/myenv/bin/python", "/workspace/infinite_loop.py"]
