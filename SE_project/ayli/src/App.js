import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Dashboard from './components/dashboard/Dashboard';
import Navbar from './components/layout/Navbar';
import CreateService from './components/services/CreateService';
import CreatePost from './components/posts/CreatePost';
import RegisterDevice from './components/services/RegisterDevice';
import ServiceHistory from './components/services/ServiceHistory';
import ServiceRequestDetails from './components/services/ServiceRequestDetails';
import PostDetails from './components/posts/PostDetails';
import Forum from './components/dashboard/Forum';
import AllServiceList from './components/services/AllServiceList';
import NewMessage from './components/messages/NewMessage';
import MessageDetails from './components/messages/MessageDetails';
import InBox from './components/dashboard/InBox';
import ReplyMessage from './components/messages/ReplyMessage';
import CreateProposal from './components/proposals/CreateProposal';
import ProposalDetails from './components/proposals/ProposalDetails';
import Proposals from './components/dashboard/Proposals';
import Invoices from './components/proposals/Invoices';
import InvoiceDetails from './components/invoices/InvoiceDetails';
import Contact from './components/dashboard/Contact';
import Payment from './components/invoices/Payment';
import BufferDetails from './components/BufferOfRejectedServices/BufferDetails';
import Buffers from './components/BufferOfRejectedServices/Buffers';

// Class-based component that contains all the components that we can nivigate through them
class App extends Component {
  render(){
    //console.log(this.state)
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />         
          <Switch>          
            <Route exact path='/' component={Dashboard} />
            <Route path='/home' component={AllServiceList} />
            <Route path='/forum' component={Forum} />
            <Route path='/service/:id' component={ServiceRequestDetails} />
            <Route path='/signin' component={SignIn} />
            <Route path='/signup' component={SignUp} />
            <Route path='/create_service' component={CreateService} />
            <Route path='/create_proposal' component={CreateProposal} />
            <Route path='/proposal/:id' component={ProposalDetails} />
            <Route path='/buffer_service/:id' component={BufferDetails} />
            <Route path='/invoice/:id' component={InvoiceDetails} />
            <Route path='/create_post' component={CreatePost} />
            <Route path='/post/:id' component={PostDetails} />
            <Route path='/proposalList' component={Proposals} />
            <Route path='/invoices' component={Invoices} />
            <Route path='/buffer' component={Buffers} />
            <Route path='/pay/:id' component={Payment} />
            <Route path='/newmessage' component={NewMessage} />
            <Route path='/replymessage' component={ReplyMessage} />
            <Route path='/inbox' component={InBox} />
            <Route path='/contact' component={Contact} />
            <Route path='/message/:id' component={MessageDetails} />
            <Route path='/register' component={RegisterDevice} />
            <Route path='/history' component={ServiceHistory} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;