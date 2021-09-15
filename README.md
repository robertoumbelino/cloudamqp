<p align="center">
  <img alt="CloudAMQP" width="200" title="CloudAMQP" src=".github/icon.png" />
</p>

<h1 align="center">POC CloudAMQP</h1>

<p align="center">
  <a href="#-techs">Techs</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-project">Project</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-license">License</a>
</p>

<p align="center">
 <img src="https://img.shields.io/static/v1?label=PRs&message=welcome&color=8257E5&labelColor=000000" alt="PRs welcome!" />

  <img alt="License" src="https://img.shields.io/static/v1?label=license&message=MIT&color=8257E5&labelColor=000000">
</p>

<br>

## 🚀 Techs

Technologies used in this project.

- [Node](https://nodejs.org/en/)
- [Typescript](https://www.typescriptlang.org/)
- [amqplib](https://www.npmjs.com/package/amqplib)

## 💻 Project

This project is a **POC** from cloudAMQP lib.

Test this project.

Needs to create `.env` file with `AMQP_URL` environment.

Servie to create AMQP_URL -> https://cloudamqp.com


```shell
yarn

yarn consumer:station
yarn consumer:customer-saver
yarn consumer:crm

yarn producer:station
```



---

Station -> Station.
```js

```

---

Station -> [Customer-Saver, CRM].
```js

```

---

Station -> [CRM].
```js

```

---

Station -> Station with priority.
```js

```

---

Station -> Station with retry.
```js

```

## 📝 License

Used MIT license.

---

By 

[👽 Roberto Umbelino](https://github.com/robertoumbelino)

[👽 Anderson Espindola](https://github.com/andersonespindola)
