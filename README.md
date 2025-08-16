# Asset Management Project

**Project setup instructions**
1. Ensure **EC2 instance** is running 
if website is not opening then
2. run **PuTTY** using the the **IP address** and your **key pair**
3. navigate to the project folder www -> actions-runner -> _work -> assetmanagement -> assetmanagement
4. Restart nginx
run sudo service nginx restart all
5. ensure runner is running  
run sudo ./svc.sh start 
6. Go to backend folder and run following command 
pm2 start “npm run start” --name=“backend”
pm2 status 
7. go to frontend folder and run the following commands
yarn run build
pm2 serve build/ 3000 --name "Frontend" --spa
pm2 save
sudo service nginx restart all
pm2 restart all
---

**Public URL of your project**
http://3.27.184.113/
---

**Provide a project-specific username and password**
Tutor@qut
1234
---

***CI/CD workflow.**
1. Change is commited and pushed to the reposotority
2. Runner is initaited to run the instructions from the yml file 
3. runner post code changes to instance and  backend server
4. Runner run the backend test 
5. Runner setup the frontend server   
---


**Jira Board URL**
https://qutifn636.atlassian.net/jira/software/projects/ASSET/boards/34/backlog?selectedIssue=ASSET-31&sprintCompleted=&atlOrigin=eyJpIjoiZTM3ODhhODBkNjFkNDY1ZDhlNGU1ODNjMWY1ZTNhNTciLCJwIjoiaiJ9
---