import { LightningElement, wire } from 'lwc'
import { publish,subscribe,unsubscribe,createMessageContext,releaseMessageContext } from 'lightning/messageService'
import queryMC from '@salesforce/messageChannel/queryMC__c'
import result from '@salesforce/apex/ConsultaCEP.getCEP';
export default class contactForm extends LightningElement {
    queryString;
    context = createMessageContext();
    
    execute(){
        console.log(result);
        this.queryString = this.template.querySelector('lightning-textarea').value;
        const message = {
            queryResult: this.queryString,
            sourceSystem: 'QueryCmp'
        };

        console.log('aqui2');
        publish(this.context, queryMC, message);
    }
}