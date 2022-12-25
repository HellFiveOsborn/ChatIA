$(function() {
    $('#chat-form').submit(async function(event) {
        
        event.preventDefault();
        const inputMessage = $('#input-message').val();
        if (!inputMessage) {
            return;
        }

        // Escapa os caracteres especiais do HTML
        const escapedMessage = inputMessage.replace(/[&<>"']/g, function(char) { return "&#" + char.charCodeAt(0) + ";"; });

        // Adiciona a mensagem enviada pelo usuário à lista de mensagens
        $('.chat').append(`<div class="message mine"><p>${escapedMessage}</p></div>`);
        $('#input-message').val('');

        // Adiciona a resposta do ChatGPT à lista de mensagens
        const message = $(`<div class="message"><p>...</p></div>`);
        $('.chat').append(message);

        // Realiza a requisição à API do ChatGPT
        const response = await fetch('/generate-response', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                input: inputMessage,
            }),
        })
        .then((response) => {
            if (response.ok) {
                return response.text();
            }
            throw new Error('Erro ao gerar resposta da API');
        })
        .then((responseText) => {
            // Remove os pontinhos e adiciona a resposta completa
            let interval = setInterval(function() {
                message.find('p').text('');
                clearInterval(interval);

                message.find('p').html("<pre>" + hljs.highlightAuto(responseText).value + "</pre>");
                $('textarea').prop("disabled", false);
                // Desce a barra de rolagem até o final do elemento .chat
                $('.chat').scrollTop($('.chat').prop('scrollHeight'));
            }, 1000);    
        });
    });
    $('textarea').on('keydown', function(event) { 
      if ( event.which == 13 && !event.shiftKey ) { 
        
        // Pressionou Enter
        $('.enviar').click(); 
        $('textarea').prop("disabled", true);

        return false;
      } 
    });

    document.querySelectorAll('.message .p').forEach(block => {
      hljs.highlightBlock(block);
    });
});