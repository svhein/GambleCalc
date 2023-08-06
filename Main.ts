
type Bet = {
    GamblerName: string,
    option: options,
    stake: number,
    multiplier: number
}

enum options {
    one = 1,
    two = 2,
    even = 3
}

const houseCut = 0.05;

// let bets: Bet[] = [
//     {playerName: "Jorma", option: options.one, stake: 100, odd: 1.5}, 
//     {playerName: "Eero", option: options.two, stake: 2, odd: 1.5},
// ]

class BetInstance{

    firstOption: string;
    secondOption: string;
    firstBets: Bet[];
    secondBets: Bet[];
    evenBets: Bet[];
    firstOptionOdd: number;
    secondOptionOdd: number;
    firstStake: number;
    secondStake: number;
    evenStake: number;
    fullStake: number;
    

    constructor(firstOption: string, secondOption: string){
        this.firstOption = firstOption;
        this.secondOption = secondOption;

        this.firstOptionOdd = 0;
        this.secondOptionOdd = 0;

        this.fullStake = 0;
        this.firstStake = 0;
        this.secondStake = 0;
        this.evenStake = 0;

        this.firstBets = [];
        this.secondBets  = [];
        this.evenBets = [];
    }

    addBet(bet: Bet): void{
        if(bet.option == options.one){
            this.firstBets.push(bet);
        }else if(bet.option == options.two){
            this.secondBets.push(bet);
        }
        else if(bet.option == options.even){
            this.evenBets.push(bet);
        }
        this.calculateStakes();
    }

    // function to calculate odds so house wins 5%
    private calculateStakes(): void{
        let firstStake = 0;
        let secondStake = 0;
        let evenStake = 0;

        for(let i = 0; i < this.firstBets.length; i++){
            firstStake += this.firstBets[i].stake;
        }

        for(let i = 0; i < this.secondBets.length; i++){
            secondStake += this.secondBets[i].stake;
        }

        for(let i = 0; i < this.evenBets.length; i++){
            evenStake += this.evenBets[i].stake;
        }

        this.firstStake = firstStake;
        this.secondStake = secondStake;
        this.evenStake = evenStake;
        this.fullStake = firstStake + secondStake;
    }

    // Housewin if first option wins
    firstOptionWin(): number{
        let sum = 0;
        for(let i = 0; i < this.firstBets.length; i++){
            sum += this.firstBets[i].stake * this.firstBets[i].odd;
        }
        return this.fullStake - sum;
    }

    // Housewin if second option wins
    secondOptionWin(): number{
        let sum = 0;
        for(let i = 0; i < this.secondBets.length; i++){
            sum += this.secondBets[i].stake * this.secondBets[i].odd;
        }
        return this.fullStake - sum;
    }

    // Housewin if even option wins
    evenOptionWin(): number{
        let sum = 0;
        for(let i = 0; i < this.evenBets.length; i++){
            sum += this.evenBets[i].stake * this.evenBets[i].odd;
        }
        return this.fullStake - sum;
    }



}

let betInstance = new BetInstance("one", "two");
betInstance.addBet({playerName: "Jorma", option: options.one, stake: 100, odd: 1.5})
betInstance.addBet({playerName: "Eero", option: options.two, stake: 29, odd: 1.5})
betInstance.calculateStakes();
console.log(betInstance.firstOptionOdd);






// let bets1 = {
//     "Mikko" : 200,
//     "Jussi" : 100,
//     "Mikko" : 50,
// }

// let bets2 = {

// }

