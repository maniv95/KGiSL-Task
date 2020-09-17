import React from 'react';
import {Button,Row,Col} from 'reactstrap';
import swal from 'sweetalert2';
class Login extends React.Component{
    constructor(props){
        super(props);
        this.state={
            username:"",
            password:""
        }
        this.onUsername = this.onUsername.bind(this);
        this.onPassword = this.onPassword.bind(this);
    }
    onUsername(a){
        this.setState({username:a.target.value});
    }

    onPassword(b){
        this.setState({password:b.target.value});
    }

    onLogin = () => {
        var formBody = [];
        formBody.push("username="+encodeURIComponent(this.state.username));
        formBody.push("password="+encodeURIComponent(this.state.password));
        formBody = formBody.join("&")
        fetch('http://localhost:8081/userLogin',{
                    method: 'post',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/x-www-form-urlencoded',
                      'Accept-Charset': 'utf-8'
                    },
                    body: formBody
        })
        .then((response) => response.json())
        .then((status) => {
          console.log("login response",status);  
          var token = status.token;
          localStorage.setItem("token",token);
          if(token!==undefined){
            this.props.history.push('/dashboard');
          }
          if(status.message=='Invalid Credentails'){
              swal.fire("Invalid Credentails","","error");
          }
        })
        .catch((err) => {
            console.log(err);
        });
      }
    
    render(){
        return(
            <div className="App">
                <header className="App-header">
                  <Row>
                     <Col>
                            <h2><b>User Login</b></h2>
                            <div>
                            <label>Username</label><br/>
                            <input type="text" value={this.state.username} onChange={this.onUsername}/>
                            </div>
                            <br/>
                            <div>
                            <label>Password</label><br/>
                            <input type="password" value={this.state.password} onChange={this.onPassword}/>
                            </div>
                            <div>
                            <Button onClick={this.onLogin}>Login</Button>
                            </div>
                    </Col>
                  </Row>
                </header>
            </div>
        );
    }
}
export default Login;