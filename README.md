# Node.js-practice
Node.js Exprress, ORM으로 하는 데이터베이스, 배포등을 연습

2022-05-17 Express 기본 익히기 완료

# Express 기본 익히기

## API 서버란?

Web Sever : 화면을 그리는데 필요한 재료(코드, 이미지)를 Response의 **Body**에 담아준다.

API Server : 요청한 작업을 처리하고 **처리한 결과**를 Response의 **Body**에 **JSON**등의 형식으로 담아준다.

### 실행

root경로에 app.js 생성후 `npm install express`

app.js에 적은 코드를 `node app.js` 로 실행한다.

## Route Parameter 개별 조회(직원 정보 조회하기) `/:id`

```jsx
const express = require('express');

const app = express();

const members = require('./api/members');

app.get('/api/members', (req, res) => {
  res.send(members);
});

app.get('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const member = members.find((m) => m.id === Number(id));
  if (member) {
    res.send(member);
  } else {
    res.status(404);
  }
});

app.listen(3000, () => {
  console.log('Server is listening...');
});
```

## Route Parameter

Express 에서는 URL의 Path 부분 중 변하는 값이 들어가는 부분은 콜론(:)을 앞에 붙여서 표현하고 이를 Route Parameter라고 한다.

`/:id` 는 특정멤버 조회를 위해 사용하는 Route Parameter 이다. [http://localhost:3000/api/members/10](http://localhost:3000/api/members/10) 처럼해서 사용한다.

## 리소스(Resource)란?

서버에 있는 자원을 리소스라고 한다. 정보, 자원 이라고 부르기도 한다. 리소스를 조회,추가,갱신,삭제 할 수 있다.

## Query 사용해보기(특정 팀만 조회하기) `?property=value`

? 뒤에 있는 걸 Query 라고한다. 서버에있는 데이터를 조회할 때 기준을 정하기 위해 사용한다.

쿼리뒤에 오는걸 파라미터라고한다. &를 더붙여 더 많은 기준을 정해서 요청할 수 있다.

리퀘스트의 쿼리 객체에 정보가 저장된다. `req.query`

```jsx
app.get('/api/members', (req, res) => {
  const { team } = req.query;
  if (team) {
    const teamMembers = members.filter((m) => m.team === team);
    res.send(teamMembers);
  } else {
    res.send(members);
  }
});
```

`?team=engineering` → team프로퍼티가 engineering 이라는 값을 갖게된다는 뜻이다.

[http://localhost:3000/api/members?team=engineering](http://localhost:3000/api/members?team=engineering) 처럼 조회하면 필터링된 팀목록을 볼 수 있다.

없는 파라미터 조회에 대해 따로 처리하지 않으면 모든 정보가 나온다.

## POST 리퀘스트를 보내는 방법

**app.get 함수는 get request에 대응하는 route handler를 등록하는 함수이다.**

post request는 처리할 일이 더 많다. 리퀘스트의 body에 등록할 데이터가 담겨오는데, 서버에서 별도로 처리해줘야 하기 때문이다.

## Rest clinent

POST 테스트를 편하게하기위해 VSC익스텐션인 Rest clinent을 설치해서 진행하면 편하다.

root경로에 test.http 를 생성해야 플러그인이 인식한다. 

GET과 POST를 적으면 sendRequest링크가 생겨서 테스트 할 수 있다.

```json
GET http://localhost:3000/api/members

###
POST http://localhost:3000/api/members
Content-Type: application/json

{
    "id": 11,
    "name": "Zake",
    "team": "Engineering",
    "position": "Android Developer",
    "emailAddress": "Zake@google.com",
    "phoneNumber": "010-xxxx-xxxx",
    "admissionDate": "2019/11/12",
    "birthday": "1992/09/17",
    "profileImage": "profile11.png"
}
```

최상단에 `app.use(express.json());` 을 추가해야 POST시 undefined가 뜨지 않는다. (미들웨어 사용)

```jsx
//전처리수행(미들웨어middleware)
app.use(express.json());

...

app.post('/api/members', (req, res) => {
  const newMember = req.body;
  members.push(newMember);
  res.send(newMember);
});
```

이처럼 미들웨어는 라우트 핸들러 이전에 리퀘스트를 받아서 처리하는 함수이다.

## 미들웨어 추가하기

Express에서 리퀘스트에 관한 처리를 하는 함수를 미들웨어라고 한다. 종종 라우트 핸들러도 미들웨어로 부르기도 한다.

request의 query를 console로 확인할 수 있는 미들웨어를 추가해보자

```jsx
function middleWare(req,res,next)  {
  console.log(req.query)
  next()
}
app.use(middleWare);
```

혹은

```jsx
app.use((req, res, next) => {
  console.log(req.query);
  next();
});
```

## nodemon과 npm start

코드 수정시 자동 재실행 되게하면 편하다. nodemon 패키지를 설치하자

`npm i nodemon --save-dev` 로 개발환경 설치후

`npx nodemon app.js` 로 실행

`node app.js` 대신 관행 표현인 `npm start`로 변경하자

nodemond을 간편하게 실행하기위해 `"dev": "nodemon app.js”`  도 추가해주자.

package.json 의 scripts를 아래와 같이 수정한다.

```jsx
"scripts": {
	"start": "node app.js",
	"dev": "nodemon app.js",
},
```

dev는 원래 npm에 없는 표현이라서 `npm run dev` 라고 해야 nodemon이 실행된다.

## PUT : 기존 직원 정보 수정하기

```jsx
app.put('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const newInfo = req.body;
  const member = members.find((m) => m.id === Number(id));
  if (member) {
    Object.keys(newInfo).forEach((prop) => {
      member[prop] = newInfo[prop];
    });
    res.send(member);
  } else {
    res.status(404).send({ message: 'There is no member with the id!' });
  }
});
```

## 객체의 프로퍼티 순회하기

특정 객체의 프로퍼티들을 순회할 때 `Object.keys()`, `Object.entries()`, `for ... in` 구문이 자주쓰인다. 

1. `Object.keys()` 는 프로퍼티 이름이 배열에 담긴다.
2. `Object.entries()` 는 key:value 쌍을 배열에 담는다. [’key’, ‘value’] 처럼 생겼다.
    
    ```jsx
    [ ’id’ 11 ],
    [ ‘name’, ‘whilliam’ ]
    ```
    
3. `for ... in`	
    
    ```jsx
    for(const property in newInfo) {
    	//프로퍼티 출력
    	console.log(property)
    
    	//프로퍼티 값 출력
    	console.log(newInfo[property])
    }
    
    /*
    id
    name
    team
    position
    */
    ```
    

## DELETE : 기존 직원 정보 삭제하기

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
