The code basically follow the tutorial [here](https://www.howtographql.com/react-apollo/0-introduction/) except for a few points:

1. All the graphql query is changed to use [django](https://github.com/ENsu/graphql-hackernews) as backend instead of the nodejs server provided in the tutorial.
2. Remember you need ```pip install django-cors-headers``` in the backend and follow the config from [here](https://pypi.org/project/django-cors-headers/) to prevent CORS POLICY issue from django.


Install dependencies
```javascript
yarn install
```

Init front-end server
```javascript
yarn start
```
