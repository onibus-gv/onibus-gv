# Ônibus GV

[![Build Status](https://travis-ci.org/knoxzin1/onibus-gv.svg?branch=master)](https://travis-ci.org/knoxzin1/onibus-gv)

Aplicativo para consultar horários de ônibus na grande vitória

## Instalando para desenvolvimento

### Pré-Requisitos

* [node.js](https://nodejs.org) >= 5.0.0 e [npm](http://npmjs.com) >= v2.0.0.
* [git](https://git-scm.com/)
* [android sdk](developer.android.com/sdk)

### Instalando

Clone o repositório e execute os seguintes comandos:

```shell
npm install
bower install
```

### Desenvolvendo

```shell
npm run gulp watch
```

e

```shell
ionic serve // Para testar no navegador ou
ionic run android // Para testar no dispositivo
```

Para testar no navegador ( chrome ) é preciso criar manualmente um banco de dados ( web sql ) e inserir os registros

### Testando

#### Unit

```shell
npm run test
```

#### E2E

Instale globalmente o [protractor](https://angular.github.io/protractor/)
```shell
npm install -g protactor
```

Após instalar atualize e inicie o selenium
```shell
webdriver-manager update
webdriver-manager start
```

E rode os testes
```shell
npm run e2e
```

### Linter
```shell
npm run eslint
```
