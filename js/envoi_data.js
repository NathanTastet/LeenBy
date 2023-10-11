const requete = new XMLHttpRequest();
requete.open("POST", "http://192.168.4.1", true);
requete.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
requete.send(JSON.stringify({ test1: "test", test2: 0xFF}));