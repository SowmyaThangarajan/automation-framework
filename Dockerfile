FROM mcr.microsoft.com/playwright:v1.47.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Install Python + fix alias
RUN apt-get update && apt-get install -y python3 python3-pip && \
    ln -sf /usr/bin/python3 /usr/bin/python && \
    python --version && \
    pip3 install pandas && \
    rm -rf /var/lib/apt/lists/*

RUN npx playwright install --with-deps

RUN pip3 install pandas

CMD ["npx", "playwright", "test"]