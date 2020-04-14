# RESTful API with Express

The RESTful implementation allows users to create, collect, update and remove American presidents. The RESTful resource is located at `/api/presidents`, with the following request types available:

- Create (POST) - creating a new president... Who knows - it can happen.
- Read (GET) - endpoints for reading one president and listing all presidents.
- Update (PUT) - to update president data.
- Delete (DELETE) - to delete one president.

Here is one president represented as JSON:

```json
{
  "id": "44",
  "from": "2009",
  "to": "2017",
  "name": "Barack Obama"
}
```

For each president the following rules apply:
* `id` is required. The next id can be calculated using the supplied `nextId`-function
* `name` is required
* `from` is required and should be the year as a YYYY-string
* `to` is not required as some presidents has not ended their tenture ... yet.


## Database Implementation 
1) with mongodb under the [mongo](https://github.com/Beadsley/presidents/tree/master/mongo) direcory

2) with PostgreSQL under the [psql](https://github.com/Beadsley/presidents/tree/master/psql) direcory

## Swagger documentation
More information can be found under the endpoint `/api/docs`.
