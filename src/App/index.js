import React, { Component, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import { injected, walletconnect, uauth, uauth2 } from "../connectors";

import '../../node_modules/font-awesome/scss/font-awesome.scss';

import Loader from './layout/Loader'
import Aux from "../hoc/_Aux";
import ScrollToTop from './layout/ScrollToTop';
import routes from "../route";

const AdminLayout = Loadable({
    loader: () => import('./layout/AdminLayout'),
    loading: Loader
});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isConnected: false,
          showDomain: false,
          domain: "",
        };
    
        this.connectMetamask = this.connectMetamask.bind(this);
        this.connectUnstoppable = this.connectUnstoppable.bind(this);
        this.logout = this.logout.bind(this);
        
      }
      
    
      async connectMetamask() {
        console.log(injected);
        console.log(this.props.web3ReactHook.activate(injected, undefined, true));
    
        this.props.web3ReactHook
          .activate(injected, null, true)
          .then((res) => {
            injected
              .getAccount()
              .then((account) => {
                console.log(account);
                this.setState({
                  isConnected: true,
                });
              })
              .catch((e) => {
                alert(e);
                console.error(e);
              });
          })
          .catch((e) => {
            alert(e);
            console.error(e);
          });
      }
    
      async connectUnstoppable() {
        injected.deactivate();
        this.props.web3ReactHook
          .activate(uauth, null, true)
          
          .then(async (res) => {
            uauth
              .getAccount()
    
              .then((account) => {
              })
              .catch((e) => {
                alert(e);
                console.error(e);
              });
          })
          .catch((e) => {
            alert(e);
            console.error(e);
          });
      }
    
      logout() {
        uauth2.uauth.logout();
        this.props.web3ReactHook.deactivate();
        injected.deactivate();
        uauth.deactivate();
        
        this.setState({
          isConnected: false,
          showDomain: false,
          domain: "",
        });
        
      }
    
    
      fetchData(){
        uauth2.uauth.user()
        .then((data) => {
          if (data) {
            if(this.state.isConnected == false){
              this.setState({
                isConnected: true,
                showDomain: true,
                domain: localStorage.getItem("uauth-default-username")
              });
            }
            
          } else {
    
          }
        })
        .catch((_err) => {});
      }
      
    render() {
        const menu = routes.map((route, index) => {
          return (route.component) ? (
              <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  render={props => (
                      <route.component {...props} />
                  )} />
          ) : (null);
        });

        return (
            <Aux>
                <ScrollToTop>
                    <Suspense fallback={<Loader/>}>
                        <Switch>
                            {menu}
                            <Route path="/" component={AdminLayout} />
                        </Switch>
                    </Suspense>
                </ScrollToTop>
            </Aux>
        );
    }
}

export default App;
