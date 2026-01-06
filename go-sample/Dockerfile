# 第一階段：編譯階段
FROM golang:1.25-alpine AS builder
WORKDIR /app
# 複製 go.mod 並下載套件
COPY go.mod go.sum ./
RUN go mod download
# 複製源碼並編譯
COPY . .
RUN go build -o main .

# 第二階段：執行階段 (為了縮小檔案體積)
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .
EXPOSE 8080
CMD ["./main"]