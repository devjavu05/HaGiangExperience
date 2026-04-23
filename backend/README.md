# Backend Structure

```
backend/
├── pom.xml
└── src/
    ├── main/
    │   ├── java/com/hagiang/localexperience/
    │   │   ├── HaGiangLocalExperienceApplication.java
    │   │   ├── common/
    │   │   │   ├── config/
    │   │   │   ├── constant/
    │   │   │   ├── exception/
    │   │   │   └── util/
    │   │   ├── experience/
    │   │   │   ├── controller/
    │   │   │   ├── dto/
    │   │   │   ├── entity/
    │   │   │   ├── repository/
    │   │   │   └── service/
    │   │   └── host/
    │   │       ├── controller/
    │   │       ├── dto/
    │   │       ├── entity/
    │   │       ├── repository/
    │   │       └── service/
    │   └── resources/
    │       ├── application.yml
    │       └── db/migration/
    └── test/
        └── java/com/hagiang/localexperience/
```

Suggested layering:
- `controller`: REST or MVC endpoints
- `service`: business logic
- `repository`: JPA access
- `entity`: persistence models
- `dto`: request/response payloads
- `common`: shared concerns like config, exception handling, helpers
