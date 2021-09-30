public class ConsultaCEP{
            @AuraEnabled(cacheable = true)
            public static  Map<String, Object> getCEP(String numCEP){
                String endpoint = 'https://viacep.com.br/ws/' + numCEP + '/json/';
                HttpRequest req = new HttpRequest();
                req.setEndpoint(endpoint);
                req.setMethod('GET');
    
                Http http = new Http();
    try{
        HttpResponse response = http.send(req);
            if(response.getStatusCode()== 200 ||response.getStatusCode()== 201){
                    Map<String, Object> cepMap = (Map<String, Object>)JSON.deserializeUntyped(response.getBody());
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