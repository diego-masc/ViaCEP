import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, getRecordNotifyChange  } from 'lightning/uiRecordApi';
import STREET_FIELD from '@salesforce/schema/Contact.MailingStreet';
import CITY_FIELD from '@salesforce/schema/Contact.MailingCity';
import POSTCODE_FIELD from '@salesforce/schema/Contact.MailingState';
import NAME_FIELD from '@salesforce/schema/Contact.Name';
import { publish,subscribe,unsubscribe,createMessageContext,releaseMessageContext } from 'lightning/messageService'
import queryMC from '@salesforce/messageChannel/queryMC__c'

export default class temperaturaMapa extends LightningElement {
    @api recordId;
    @track mapMarkers = [];
    subscription = null;
    context = createMessageContext();
    renderedCallback() {
        this.subscription = subscribe(this.context, queryMC, (message) => {
            this.displayMessage(message);
        });
    }

    displayMessage(message) {
        let cepMessage = message.queryResult
        console.log(cepMessage.localidade + ' 23 Message');
            this.mapMarkers = [
                {
                    location: {
                        Street: cepMessage.logradouro,
                        City: cepMessage.localidade,
                        State: cepMessage.uf

                    },
                    title: 'Endereço:',
                    description: cepMessage.logradouro + '</br>'+ cepMessage.localidade + '</br>'+ cepMessage.uf
                }
            ]
        }
    @wire(getRecord, {recordId: '$recordId', fields: [STREET_FIELD, CITY_FIELD, POSTCODE_FIELD, NAME_FIELD]})
    fetchC({data, error}) {
        console.log('To aqui2.');
        if (data) {
        this.mapMarkers = [
            {
                        location: {
                            Street: data.fields.MailingStreet.value,
                            City: data.fields.MailingCity.value,
                            State: data.fields.MailingState.value
                        },
    
                        title: data.fields.Name.value,
                        description: 'Deu certo pra caralho'
                    }
                    ];
        } else if (error) {
            console.error('ERROR => ', error);
        }
    }
    disconnectedCallback() {
        releaseMessageContext(this.context);
    }
    
}