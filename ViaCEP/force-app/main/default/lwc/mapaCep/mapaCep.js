import { LightningElement, api, wire, track } from 'lwc';
import cepMap from '@salesforce/apex/ConsultaCEP.getCEP';
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
        console.log(message.queryResult + ' 23');
        //this.mapMarkers[0].description = message.queryResult;
        console.log(JSON.stringify(this.mapMarkers[0].description) + ' 25');
        var newMarkers = this.mapMarkers[0];
        newMarkers.description = message.queryResult;
        getCEP({cep: message.queryResult})
        .then (result => {
            console.log(result);
            this.mapMarkers = [
                {
                    location: {
                        Street: result[0],
                        City: result [1],
                        State: result[2]

                    },
                    title: 'Titulo',
                    Description: '123'
                }
            ]
        }

        )
        this.mapMarkers = [];
        this.mapMarkers.push(newMarkers);
        console.log(this.mapMarkers);
        //getRecordNotifyChange([{recordId: this.recordId}]);
    }
    @wire(getRecord, {recordId: '$recordId', fields: [STREET_FIELD, CITY_FIELD, POSTCODE_FIELD, NAME_FIELD]})
    fetchC({data, error}) {
        console.log('To aqui2.');
        if (data) {
            cepMap({cidade: data.fields.MailingCity.value})
            .then(result => {
                this.mapMarkers = [
                    {
                        location: {
                            Street: data.fields.MailingStreet.value,
                            City: data.fields.MailingCity.value,
                            State: data.fields.MailingState.value
                        },
    
                        title: data.fields.Name.value,
                        description: result
                    }
                ];
            })
            .catch(error => {
                console.log(error);
            });
            
            console.log('this.mapMarkers => ', JSON.stringify(this.mapMarkers));
        } else if (error) {
            console.error('ERROR => ', error);
        }
    }
    disconnectedCallback() {
        releaseMessageContext(this.context);
    }
    
}