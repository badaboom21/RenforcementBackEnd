### Jonathan Boulay

pour lancer l'application : docker compose up -d

Installer les librairy : 
 - docker compose run app-assurmoi-app npm i
 - docker compose run app-assurmoi-node npm i

Pour la bdd : 
 - docker compose run app-assurmoi-node npx sequelize-cli db:migrate
 - docker compose run app-assurmoi-node npx sequelize-cli db:seed:all

pour le .env dans assurmoi, tester avec ces variables : 

PORT=3000

DB_USERNAME=root
DB_PASSWORD=root
DB_HOST=db
DB_PORT=3306
DB_NAME=assurmoidb

JWT_SECRET=Jd5ixcrtQQ0HdQw/Z8Zek/GayWSnT359VgBccHUiUA4=
JWT_EXPIRES_IN=1h
BCRYPT_SALT_ROUNDS=12
CORS_ORIGINS=http://localhost:3000,http://localhost:8081

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=jojolagrig@gmail.com
SMTP_PASS=iyyf dcft eoji xvba 

Pour avoir accès au swagger : http://localhost:3000/api-docs/

## Si l'appli ne se lance pas ou que vous avez l'erreur suivante : 

2026-04-24 15:46:45 CommandError: failed to start tunnel
2026-04-24 15:46:45 
2026-04-24 15:46:45 session closed

Alors supprimer dans le package.json dans le dossier assurmobile (le front) le --tunnel sur la ligne suivante : 
    "start": "expo start --tunnel",
Puis faire docker compose down, supprimer tous les containers sur docker puis faire docker compose up -d

email : john.doe@gmail.com
mot de passe : AdminPass123

<img width="596" height="388" alt="image" src="https://github.com/user-attachments/assets/a86095b5-e46c-4bb1-a97e-f823bd008247" />

<img width="647" height="211" alt="image" src="https://github.com/user-attachments/assets/fa42ba84-d2ff-4640-8a07-b87f341f6b75" />

<img width="604" height="404" alt="image" src="https://github.com/user-attachments/assets/64403ce4-c223-49c1-8683-694fa57cf504" />

<img width="540" height="806" alt="image" src="https://github.com/user-attachments/assets/ccf4f356-d7ad-4ea2-ac03-75a43ce6e13c" />

