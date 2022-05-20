# Node.js-practice
Node.js Exprress, ORM으로 하는 데이터베이스, 배포등을 연습

2022-05-17 Express 기본 익히기 완료

# ORM으로 하는 데이터베이스 작업

ORM으로 데이터베이스 편리하게 관리할 수 있음

`npm install mysql2 sequelize sequelize-cli` 으로 설치

`npx sequelize init` 으로 초기화

데이터베이스 생성하는 명령어

```jsx
npx sequelize db:create --env development
```

- development 라는 객체에 적은 내용을 바탕으로 데이터베이스 생성
- 옵션을 안적으면 기본적으로 development 객체가 지원됨

Database database_development created.
