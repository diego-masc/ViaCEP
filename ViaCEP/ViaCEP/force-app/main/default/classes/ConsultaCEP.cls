public class ConsultaCEP{
            @AuraEnabled(cacheable = true)
            public static  Map<String, Object> getCEP(String numCEP){
                //numCEP = EncodingUtil.URLEncode(numCEP);
                String endpoint = 'https://viacep.com.br/ws/' + numCEP + '/json/';
                HttpRequest req = new HttpRequest();
                req.setEndpoint(endpoint);
                req.setMethod('GET');
    
                Http http = new Http();
                //HttpResponse response = http.send(req);
    
                // String result = '';
    try{
        HttpResponse response = http.send(req);
            if(response.getStatusCode()== 200 ||response.getStatusCode()== 201){
                    Map<String, Object> cepMap = (Map<String, Object>)JSON.deserializeUntyped(response.getBody());
                    // System.debug('Endereço: ' + cepMap.get('cep'));
                    // result = 'Endereço: ' + cepMap.get('cep');
                    return cepMap;
                }
              else {
                        System.debug(response);
                        throw new CustomException('Erro Status Code'+ response.getStatusCode());
                    }   
        }
        catch (Exception e){
            System.debug(e.getMessage());
            throw new CustomException(e.getMessage());
        }
    }
    }