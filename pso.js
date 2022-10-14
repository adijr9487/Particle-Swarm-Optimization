// ================================================================

//functions.
//SPHERE
const Sphere = (position) => {
    //Summation of x*x;

    let val = 0;
    for (let i = 0; i < Dimensions; i++) {
        val += position[i] * position[i];
    }
    return val;
}


//ROSENBROCK
const Rosenbrock = (position) => {
    let val=0;
    for (let i = 0; i < Dimensions - 1; i++) {
        val += 100 * (position[i+1] - position[i] * position[i]) * (position[i+1] - position[i] * position[i]) + (1 - position[i]) * (1 - position[i]);
    }
    return val;
}

//RASTRIGIN
const Rastrigin = (position) => {

    let n = 2;
    let A = 10;
    let val = A * n;
    for (let i = 0; i < Dimensions; i++) {
        val += (position[i] * position[i] - A * Math.cos(Math.PI * 2 * position[i]));
    }
    return val;
}

//ACKLEY
const Ackley = (position) => {
    //only 2 parameter
    let x = position[0];
    let y = position[1];
    let val = -20*Math.exp(-0.2*Math.sqrt(0.5*(x*x+y*y))) - Math.exp(0.5*(Math.cos(2*Math.PI*x)+Math.cos(2*Math.PI*y))) + (Math.E + 20);
    return val;

}



// evalute function 
const evaluate = (particle) => {

    if (function_optimization == "RASTRIGIN") {
        return Rastrigin(particle);
    } else if (function_optimization == "ROSENBROCK") {
        return Rosenbrock(particle);
    } else if (function_optimization == "ACKLEY") {
        return Ackley(particle);
    } else if (function_optimization == "SPHERE") {
        return Sphere(particle);
    }
}

// calculate fitness 
const fitness = (particle) => {
    return (1 /(1+evaluate(particle)));
}

// Initialize Particles
const InitializeParticles = () => {
    let dim;
    let element;
    for (let i = 0; i < P_size; i++){
        element = [];
        for (let i = 0; i < Dimensions; i++){
            dim = Lower + (Upper - Lower) * Math.random();
            element.push(dim);
        }
        particle_population.push(element);
    }
}

//initialize particles velocity
const InitializeVelocity = () => {
    for (let i = 1; i <= P_size; i++){
        velocity.push(new Array(Dimensions).fill(0));
    }
}

//update particle fitness
const updateParticleFitness = () => {
    particles_fitness = particle_population.map((particle) => {
        return fitness(particle)
    })
}

//const get global best index
const updateGlobalBest = () => {
    //finding best
    let bestFit = fitness(local_best[0]);
    let bestIDX = 0;
    for (let i = 1; i < P_size; i++) {
        let currentFitness = fitness(local_best[i]);
        if (bestFit < currentFitness) {
            bestIDX = i;
            bestFit = currentFitness;
        }
    }
    global_best = [...particle_population[bestIDX]];
}

//update velocity
const velocityUpdate = () => {

    let r1, r2;
    for (let i = 0; i < P_size; i++) {
        for (let j = 0; j < Dimensions; j++){
            r1 = Math.random();
            r2 = Math.random();
            velocity[i][j] = velocity_weight * velocity[i][j] + acc_1 * r1*(global_best[j] - particle_population[i][j]) + acc_2 * r2*(local_best[i] - particle_population[i][j]);
        }
    }
    
}

//update position
const positionUpdate = () => {
    for (let i = 0; i < P_size; i++){
        for (let j = 0; j < Dimensions; j++){
            particle_population[i][j] = particle_population[i][j] + velocity[i][j];
            
            if (particle_population[i][j] > Upper)
                particle_population[i][j] = Upper;
            if (particle_population[i][j] < Lower)
                particle_population[i][j] = Lower;
        }
    }
    
}

//compare with local best
const compare_with_local_best = () => {
    //particle fitness has updated fitness
    //particle_population has updated particle position

    for (let i = 0; i < P_size; i++){
        if (particles_fitness[i] > fitness(local_best[i])) {
            local_best[i] = particle_population[i];
        }
    }
}


//Domains and Dimentions
let particle_population = [];
let P_size = 5;
let velocity = []

// let Lower = -5;
// let Upper = 5;
// let Dimensions = 5;
// let function_optimization = "SPHERE"


let Lower=-5;
let Upper=5;
let Dimensions = 2;
let function_optimization = "RASTRIGIN";

// let Lower=-500;
// let Upper=500;
// let Dimensions = 3;
// let function_optimization = "ACKLEY";

// let Lower=-100;
// let Upper=100;
// let Dimensions = 10;
// let function_optimization = "ROSENBROCK";

let particles_fitness = [];
let local_best = [];
let global_best = []; //1 particle cordinate

//starting variables
let velocity_weight = 0.75;
let acc_1 = 1.5;
let acc_2 = 2;

//initializing particle position and their velocity
InitializeParticles();
InitializeVelocity();

//update particle fitness
updateParticleFitness();
local_best = particles_fitness;
//update global best
updateGlobalBest();

console.log(evaluate(global_best))

let generation = 1;
console.log(`Generation ${generation}: ${evaluate(global_best)}`)

while (generation < 50000) {

    //velocity Update
    velocityUpdate();

    //position update
    positionUpdate();
    
    //new local best
    updateParticleFitness();
    
    //new population in particle_population
    //new finess in particle_fitness
    // compare which particle is better with local best 
    
    compare_with_local_best();
    
    //update global best
    updateGlobalBest();
    // console.log(evaluate(global_best))


    generation++;
}
console.log(`Generation ${generation}: ${evaluate(global_best)}`)


