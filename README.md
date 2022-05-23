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

```jsx
app.delete('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const membersCount = members.length;
  members = members.filter((member) => member.id !== Number(id));
  if (members.length < membersCount) {
    res.send({ message: 'Delete' });
  } else {
    res.status(404).send({ message: 'There is no member with the id!' });
  }
});
```

```jsx
DELETE  http://localhost:3000/api/members/1
Content-Type: application/json

  {
    "id": 1,
    "name": "Alex",
    "team": "engineering",
    "position": "IOS Developer",
    "emailAddress": "alex@google.com",
    "phoneNumber": "010-xxxx-xxxx",
    "admissionDate": "2018/12/10",
    "birthday": "1994/11/08",
    "profileImage": "profile1.png"
  }
```

# ORM으로 하는 데이터베이스 작업

## 데이터베이스란?

데이터베이스를 다루기 위해 사용하는 소프트웨어는 DBMS로 이는 Database Management System의 약어이다. DBMS에 SQL이라는 DB전용 언어로 명령을 내리면 원하는 DB작업을 수행할 수 있다.

## ORM이란?

- ORM으로 데이터베이스를 편리하게 관리할 수 있다.
- Object Relational Mapping의 줄임말이다. DB에 있는 데이터를 코드 상의 객체에 대응한다. 객체를 다루는 코드를 통해 데이터베이스 작업을 수행할 수 있게 해주는 기술을 총칭하는 말이다. ORM을 쓰면 SQL을 잘 사용하지 못해도 DB작업을 할 수 있다. 이상적인 학습 형태는 SQL을 먼저 배우고 ORM을 배우는게 좋지만 실제 개발을 먼저 배우기 위해 ORM으로 개발을하고, 필요한 DB 지식을 학습하자.

`npm install mysql2 sequelize sequelize-cli` 으로 설치

`npx sequelize init` 으로 초기화

## 데이터 베이스 생성하기

데이터베이스 생성하는 명령어

```jsx
npx sequelize db:create --env development
```

- development 라는 객체에 적은 내용을 바탕으로 데이터베이스 생성
- 옵션을 안적으면 기본적으로 development 객체가 지원됨
- Database database_development created. 나오면 성공

## 모델과 테이블 생성

Database의 Table은 Sequelize에서 하나의 js Class 이다.

Database의 Row는 js Class안의 객체이다.

Sequeliz-cli로 Member Class를 만들어보자

```jsx
npx sequelize model:generate --name Member --attributes name:string,team:string,position:string,emailAddress:string,phoneNumber:string,admissionDate:date,birthday:date,profileImage:string
```

<aside>
🔔 Sequelize CLI [Node: 16.15.0, CLI: 6.4.1, ORM: 6.19.2]

New model was created at /Users/park-siwan/Documents/projects/Node.js-practice/models/member.js .
New migration was created at /Users/park-siwan/Documents/projects/Node.js-practice/migrations/20220521143605-create-member.js .

</aside>

마이그레이션이란?

- 데이터베이스 내부에서 일어나는 모든 변경사항
- 테이블 생성, 컬럼추가 등에 해당

migrations 폴더안의 create-member.js 를 보면 up: 과 down: 메소드가 있다.

```jsx
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Members', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      team: {
        type: Sequelize.STRING
      },
      position: {
        type: Sequelize.STRING
      },
      emailAddress: {
        type: Sequelize.STRING
      },
      phoneNumber: {
        type: Sequelize.STRING
      },
      admissionDate: {
        type: Sequelize.DATE
      },
      birthday: {
        type: Sequelize.DATE
      },
      profileImage: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Members');
  }
};
```

- 우리가 정의했던 멤버 모델에 대응되는 테이블을 실제 데이터 베이스에 만드는 코드이다.
- up메소드는 마이그레이션을 적용할 때 실행한다.
- down메소드는 마이그레이션을 적용해제 할 때 실행한다.
- `queryInterface.createTable()` 로 테이블 생성할 수 있다 첫번째 인자로 테이블 이름을, 두번째 인자로 컬럼을준다

테이블을 생성할 때 Member라고 단수로 적었지만 s가 붙은 이유는 sequelize가 모델이름을 단수로 정해도 테이블 이름을 자동으로 복수형으로 s를 붙여 변환한다.

컬럼의 가장 마지막을 보면 정의한적 없는 createAt 과 updateAt 컬럼이 생성되어있다.   sequelize cli 명령어가 테이블의 생성시간과 갱신시간을 기록해주기 위해서 생성한 것이다.

createAt, updateAt컬럼에 현재 시간을 자동으로 들어가게 설정할 수 있다.

```jsx
defaultValue: Sequelize.fn('now')
```

- defaultValue로  컬럼에 값을 넣지 않았을 때 기본값을 설정할 수 있다.

이러한 마이그레이션을 적용하면 up 메소드의 내용이 실행되면서 데이터베이스에 Members라는 테이블이 생성된다. 마이그레이션을 적용 해제하면 down 메소드가 실행된다. `queryInterface.dropTable(’Members’)` 으로 테이블이 삭제된다는 뜻이다.

### 마이그레이션을 적용하는방법

아래 명령어를 입력하면 마이그레이션이 적용되고, 테이블이 생성된다.

```powershell
npx sequelize db:migrate
```

- migrations 디렉토리 안에 있는 마이그레이션 파일들이 각각 이름에 있는 날짜 시간순으로 실행된다.

## 테이블 지우는 방법

```powershell
npx sequelize db:migrate:undo
```

- 만약 DB에 있던 데이터가 전부 삭제되어도 마이그레이션 파일들로 잘 보관되어 있으면 복원하는 것이 가능하다.

## 데이터타입

각 프로퍼티에서 설정했던 데이터 타입은 데이터베이스 테이블의 각 컬럼에 데이터 타입으로 적용된다.

- Sequelize.STRING은 문자열 타입이다.
    - DB안에서 `VARCHAR(255)`로 변환된다.
- Sequelize.INTEGER는 정수형 타입이다.
    - DB안에서 `INTEGER`로 변환된다.
- Sequelize.FLOAT는 실수형 타입이다.
    - DB안에서 `FLOAT`로 변환된다.
- Sequelize.DATE는 날짜형 타입이다.
    - DB안에서 `DATETIME`으로 변환된다.

그외 Sequelize 공식 페이지 링크 참조 : [https://sequelize.org/v5/manual/data-types.html](https://sequelize.org/v5/manual/data-types.html)

## Primary key란?

```jsx
id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
```

데이터베이스의 테이블에서 특정 row를 고유하게 식별 할 수 있게 해주는 column

ex) id 프로퍼티는 id column에 추가되어 DB의 primary key가 된다.

`allowNull = false` 란 Null을 허용하지 않으니 해당 column에는 항상 값이 있어야 한다는 말이다. = 필수값

`autoIncrement`는 새로운 직원 정보를 삽입할 때 id값이 자동으로 +1 해서 생성된다.

## Seed 데이터 넣기

```powershell
npx sequelize seed:generate --name initialMembers
```

seeders 라는 폴더에 initialMembers.js 라는 시더파일이 생성되었다.

```jsx
'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
```

migration 파일과 비슷하게 생겼다.

아래와같이 테스트해보자

```jsx
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Members',
      [
        {
          id: 1,
          name: 'Alex',
          team: 'engineering',
          position: 'Server Developer',
          emailAddress: 'alex@google.com',
          phoneNumber: '010-xxxx-xxxx',
          admissionDate: '2018/12/10',
          birthday: '1994/11/08',
          profileImage: 'profile1.png',
        },
        {
          id: 2,
          name: 'Benjamin',
          team: 'engineering',
          position: 'Server Developer',
          emailAddress: 'benjamin@google.com',
          phoneNumber: '010-xxxx-xxxx',
          admissionDate: '2021/01/20',
          birthday: '1992/03/26',
          profileImage: 'profile2.png',
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('People', null, {});
  },
};
```
