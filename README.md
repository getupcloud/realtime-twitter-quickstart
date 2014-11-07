Esta aplicação demonstra o uso de WebSockets em uma aplicação NodeJS, apresentando em tempo real os tweets contendo uma palavra específica.

Crie uma conta em http://getupcloud.com e [instale o CLI](https://getup.zendesk.com/entries/38781627).
Você recebe 750h gratis para testar nosso serviço.

### Credenciais

Primeiro é necessário ter acesso a suas credenciais do Twitter. Crie uma [aplicação](https://apps.twitter.com/) e anote as seguintes credenciais:

   - Consumer Key (API Key)
   - Consumer Secret (API Secret)
   - Access Token
   - Access Token Secret

### Criando a aplicação

Execute o seguinte comando para criar uma aplicação NodeJS usando este repositório como código inicial:

    rhc app-create twitter nodejs-0.10 \
      --from-code git://github.com/getupcloud/realtime-twitter-quickstart.git \
      TWITTER_API_KEY="<API Key>" \
      TWITTER_API_SECRET="<API Secret>" \
      TWITTER_ACCESS_TOKEN="<Access Token>" \
      TWITTER_ACCESS_TOKEN_SECRET="<Access Token Secret>" \
      HASHTAG="#nodejs"

O comando acima cria uma aplicação `nodejs-0.10` chamada `twitter`, exportando as chaves de acesso do twitter (`TWITTER_*`) para dentro do servidor como variáveis de ambiente.
A variáveis `HASHTAG` determina qual o termo usado para filtar os tweets na busca.
