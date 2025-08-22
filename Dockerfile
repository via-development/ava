FROM oven/bun:1.2-debian AS production
WORKDIR /usr/src/ava

COPY . .
# install dependencies
RUN bun install --production

USER bun
EXPOSE 3002/tcp
ENTRYPOINT [ "bun", "run", "index.ts" ]