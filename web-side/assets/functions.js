function detectCodeLanguage(code) {
  // Expressões regulares para detectar os principais tipos de linguagens de programação
  const htmlRegex = /<[^>]*>|<[^>]*\/>/;
  const phpRegex = /<\?php|(?:^|[^\w])\$\w+|function\s*\(|(?:abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|final|finally|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|namespace|new|or|print|private|protected|public|require|require_once|return|static|switch|throw|trait|try|unset|use|var|while|xor|{|}|\?|>)\b|\/\/.*|\/\*[\s\S]*?\*\//;
  const javascriptRegex = /(^|\s)function\s*\(|class\s*[A-Za-z0-9_$]*\s*\{/;
  const pythonRegex = /^#!\/usr\/bin\/env\s*python|def\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\(/;
  const cssRegex = /^[\s{]*([-\w]+)\s*:\s*([^;]+);?|@[a-zA-Z-]+/;
  const regexes = [
    { language: "html", regex: htmlRegex },
    { language: "php", regex: phpRegex },
    { language: "javascript", regex: javascriptRegex },
    { language: "python", regex: pythonRegex },
    { language: "css", regex: cssRegex },
  ];

  for (const { language, regex } of regexes) {
    if (regex.test(code)) {
      return language;
    }
  }

  // Se nenhuma das expressões regulares foi encontrada, retorna "Desconhecida"
  return "text";
}


function formatResponse(responseText) {
  const lines = responseText.split('\n');
  let formattedResponse = '';
  let inCode = false;
  let codeLanguage = '';

  console.log(lines);

  for (const line of lines) {
    // Verifica se a linha é um código de programação ou não
    const detectedCodeLanguage = detectCodeLanguage(line);

    if (detectedCodeLanguage !== "desconhecida") {
      if (!inCode) {
        // Inicia o código
        codeLanguage = detectedCodeLanguage;
        formattedResponse += `<pre><code class="language-${codeLanguage}">`;
        inCode = true;
      }
      // Adiciona a linha de código ao <code>
      formattedResponse += line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '\n';
    } else {
      if (inCode) {
        // Fecha o código
        formattedResponse += '</code></pre>';
        inCode = false;
      }
      // Se o texto não parece ser código de programação, adiciona o texto normalmente
      formattedResponse += line;
    }
  }

  if (inCode) {
    // Fecha o código caso ainda esteja aberto
    formattedResponse += '</code></pre>';
  }

  return formattedResponse;
}