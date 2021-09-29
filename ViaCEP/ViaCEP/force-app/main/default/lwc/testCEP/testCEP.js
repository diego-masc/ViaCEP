import { LightningElement, wire, track } from 'lwc'
import { publish,subscribe,unsubscribe,createMessageContext,releaseMessageContext } from 'lightning/messageService'
import queryMC from '@salesforce/messageChannel/queryMC__c'
import getCEP from '@salesforce/apex/ConsultaCEP.getCEP';
export default class contactForm extends LightningElement {
    @track
    @track context = createMessageContext();
    execute(){
        getCEP({numCEP: this.template.querySelector('lightning-textarea').value})
        .then (result => {
            console.log(result);
            const message = {
            queryResult: result,
            sourceSystem: 'QueryCmp'
            };

        console.log('aqui2');
        publish(this.context, queryMC, message);
       
        }).catch(error => {window.console.log(JSON.stringify(error) + 'erro linha 22')});  
    }
}