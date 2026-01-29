


class PostHandler  {

    static clientId = Math.random().toString(36).substr(2, 9);
   
    
constructor(){
  this.serverUrl = 'http://localhost:8080';

}


postData = async (data) => {
    try {
      const response = await fetch(this.serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({data:data,clientId:this.clientId})
      });
      const result = await response.json();
      console.log('Response:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

}
