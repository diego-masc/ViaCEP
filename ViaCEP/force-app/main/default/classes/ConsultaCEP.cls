public class ConsultaCEP{
            @AuraEnabled(cacheable = true)
            public static String getCEP(String numCEP){
                //numCEP = EncodingUtil.URLEncode(numCEP);
                String endpoint = 'https://viacep.com.br/ws/' + numCEP + '/json/';
                HttpRequest req = new HttpRequest();
                req.setEndpoint(endpoint);
                req.setMethod('GET');
    
                Http http = new Http();
                HttpResponse response = http.send(req);
    
                String result = '';
    
            if(response.getStatusCode()== 200 ||response.getStatusCode()== 201){
                    Map<String, Object> cepMap = (Map<String, Object>)JSON.deserializeUntyped(response.getBody());
                    System.debug('Endereço: ' + cepMap.get('cep'));
                    result = 'Endereço: ' + cepMap.get('cep');
                }
             else {
                        System.debug('Erro ao chamar o ViaCEP');
                }   
             return result;
        }
    }