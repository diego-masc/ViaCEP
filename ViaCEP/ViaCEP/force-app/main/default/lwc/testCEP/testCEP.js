import { LightningElement, wire, track, api } from 'lwc'
import { publish,subscribe,unsubscribe,createMessageContext,releaseMessageContext } from 'lightning/messageService'
import queryMC from '@salesforce/messageChannel/queryMC__c'
import getCEP from '@salesforce/apex/ConsultaCEP.getCEP';
import { updateRecord} from 'lightning/uiRecordApi';
import STREET_FIELD from '@salesforce/schema/Contact.MailingStreet';
import CITY_FIELD from '@salesforce/schema/Contact.MailingCity';
import POSTCODE_FIELD from '@salesforce/schema/Contact.MailingPostalCode';
import STATE_FIELD from '@salesforce/schema/Contact.MailingState';
// import cepMap from '@salesforce/apex/ConsultaCEP.getCEP';
import { ShowToastEvent }from 'lightning/platformShowToastEvent';
import ID_FIELD from '@salesforce/schema/Contact.Id';

export default class contactForm extends LightningElement {
    @api recordId;
    @track rua;
    @track cep;
    @track cidade;
    @track uf;
    @track context = createMessageContext();
    rua = STREET_FIELD;
    execute(){
        getCEP({numCEP: this.template.querySelector('lightning-textarea').value})
        .then (result => {
            console.log(result);
            const message = {
            queryResult: result,
            sourceSystem: 'QueryCmp'
            };
            this.rua = result.logradouro;
            this.cep = result.cep;
            this.cidade = result.localidade;
            this.uf = result.uf;
        console.log('aqui2');
        publish(this.context, queryMC, message);
       
        }).catch(error => {window.console.log(JSON.stringify(error) + 'erro linha 22')});  
    }
    executeupdate(){
        console.log(this.rua + 'aqui38');
        const fields ={};
        fields[ID_FIELD.fieldApiName] = this.recordId;
        fields[STREET_FIELD.fieldApiName] = this.rua;
        fields[CITY_FIELD.fieldApiName] = this.cidade;
        fields[POSTCODE_FIELD.fieldApiName] = this.cep;
        fields[STATE_FIELD.fieldApiName] = this.uf
        console.log(STREET_FIELD.fieldApiName + 'aqui44');
        const recordInput = { fields };
        updateRecord(recordInput);
                then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Contact updated',
                            variant: 'success',
                        })
                    );
                    this.success = 'Contato Atualizado'
                    setTimeout(()=>{
                    },3000)
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error creating record',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                });

    }
}