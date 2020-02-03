# Chat-room-client

This chat-room application is a place to talk to and keep in touch with friends!
Users can join and make chat-rooms to socialize, plan, and work. It
integrates socket.io, a third party application, that allows the server to
'listen' for messages coming from certain rooms and then send out those messages
to users who are also listening on those rooms. It runs on node.js and express
for its user interface and functionality.

![App Screen Shot](/appScreenshot.png)

## Links
Deployed frontend: https://sgigli.github.io/chat-room-client-BT/
Backend repo: https://github.com/sgigli/chat-room-api
Deployed backend: https://agile-citadel-40916.herokuapp.com/
Wireframe: https://imgur.com/a/U6XZULT
User Stories: https://imgur.com/a/ggr2EQP

## Technologies Used
Socket.io, Node.js, Express, MongoDB, Bootstrap

## Unsolved Issues
A way to allow private communication between individuals or groups; a friendlier
user interface; support usage from different devices.

## Development story: Planning, Process, and Problem Solving
I wanted to practice integrating a third party resource in a manageable and fun
project that would teach me more about the backend side of development. So I
choose to create a chatroom using socket.io, trying to go through the
documentation and understand how it fit in with the server, api, and frontend.

I sketched out an idea (through wireframes and an ERD) of how I wanted the app
to look and what resources I expected that I would need. I then sketched out my
first impressions of how I would integrate socket.io. When I began coding, I
first practiced using socket.io to help me understand more how it worked and how
I expected to put it into the app. From there, I built out my resource and
decided to use socket.io as responses to the api calls.

Troubleshooting played an important role and I adjusted the timing and placement
of socket.io as I understood more how it worked and how my app would function.
In the end, it was an exciting venture into pairing my own code with a third
party resource.
