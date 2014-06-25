## Start Mongo
```
> cd devList
> mongod --dbpath data/
```

## Create Mongo Collection
```
> use developers
> db.users.save({name:joel})
```


## Collect Data
```
> node collect.js
```

## Start the Node Server
```
> node server.js
```
