
# DragonMaze

**Número da Lista**: 1<br>
**Conteúdo da Disciplina**: Grafos<br>

## Alunos
|Matrícula | Aluno |
| -- | -- |
| 16/0119316  |  Ezequiel de Oliveira dos Reis |
| 16/0148375  |  Vitor Leal dos Santos |

## Sobre 

  - O jogo consiste em 5 níveis de um labirinto onde o jogador deve ultrapassar sem ser pego pelo guardião do labirinto.<br>
  
  - O algorítmo usado para gerar o labirinto trata-se de uma busca em profundidade (DFS) onde o nó vizinho é escolhido aleatoriamente.
  
  - O dragão realiza uma busca em largura (BFS) para determinar a localização do jogador e perseguí-lo ao longo do labirinto, o dragão faz uma nova busca de acordo com a movimentação do jogador. O dragão pode ser lento então o jogador pode se aproveitar disso!

## Screenshots
![Imagem tutorial 1](/tutorial/initial-screen.png)
![Imagem tutorial 2](/tutorial/maze.png)
![Imagem tutorial 3](/tutorial/gameOver.png)

## Instalação 
**Linguagem**: JavaScript<br>
**Framework**: p5.js<br>

  Para rodar o projeto localmente, devemos ter a linguagem Python instalada no sistema, e em seguida executar os seguintes comandos no terminal:<br><br>
  - Clonar o repositório:
```sh 
git clone https://github.com/projeto-de-algoritmos/Grafos1_DragonMaze
```

- Em seguida devemos subir um servidor http em python para que seja possível o carregamento das imagens estáticas que foram utilizadas no jogo, para isso executaremos

```sh
python -m SimpleHTTPServer
```

- Abra o browser de sua escolha e digite o seguinte endereço
```sh
localhost:8000
```

- Link para o video de demonstrativo [Video](./tutorial/DragonMaze.mp4)

- Caso queira executar o projeto sem realizar o clone, é necessário apenas acessar o link https://projeto-de-algoritmos.github.io/Grafos1_DragonMaze/ e jogar.


## Uso 

Para movimentar o personagem, utilize as setas do teclado e tente chegar ao fim do labirinto sem ser pego pelo dragão
