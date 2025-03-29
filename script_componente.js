class AulasComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.hoje = "ter"; // Dia da semana atual
    }

    connectedCallback() {
        this.loadData();
        // Observe mudanças na classe do body para detectar mudanças de tema
        this.observeThemeChanges();
    }

    observeThemeChanges() {
        // Verifica o tema atual no carregamento
        this.updateTheme();
        
        // Observe mudanças na classe do documento body
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    this.updateTheme();
                }
            });
        });
        
        observer.observe(document.body, { attributes: true });
    }
    
    updateTheme() {
        // Atualiza o tema do componente baseado na classe do body
        const isDarkTheme = document.body.classList.contains('tema-dark');
        const themeAttribute = isDarkTheme ? 'dark' : 'light';
        this.shadowRoot.host.setAttribute('data-theme', themeAttribute);
    }

    async loadData() {
        try {
            const response = await fetch('aulas.json');
            const aulas = await response.json();
            this.render(aulas);
        } catch (error) {
            console.error('Erro ao carregar os dados das aulas:', error);
        }
    }

    render(aulas) {
        const aulasDia = aulas.filter(a => a.data === this.hoje);
    
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'styles_componente.css'; 
        this.shadowRoot.appendChild(link);
    
        this.shadowRoot.innerHTML += `
            <div>
                ${aulasDia.map(a => {
                    let provaDisplay = a.prova_alert ? '' : 'display: none;';
                    let corNota = this.getNotaColor(a.nota);
    
                    return `
                        <div class="comp-aula">
                            <div class="lable-prova p_lable" style="${provaDisplay}">PROVA: <b>${a.prova}</b></div>
                            <div class="titulo_aula">${a.disciplina}</div>
                            <p class="p">Local e Horário: <b>${a.local} - ${a.horario}</b></p>
                            <div class="info-container">
                                <div class="lable-frequencia p_lable">FALTAS: <b>${a.frequencia}</b></div>
                                <div class="lable-nota p_lable" style="background-color: ${corNota};">CR: <b>${a.nota}</b></div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
        // Aplica o tema atual após renderizar
        this.updateTheme();
    }

    // Função para determinar a cor da nota
    getNotaColor(nota) {
        if (nota < 6) {
            return 'red'; // Vermelho para notas abaixo de 6
        } else if (nota < 8) {
            return 'orange'; // Laranja para notas entre 6 e 8
        } else {
            return 'green'; // Verde para notas 8 ou superiores
        }
    }
}

customElements.define('aulas-component', AulasComponent);