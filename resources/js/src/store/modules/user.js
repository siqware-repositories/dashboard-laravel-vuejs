import axios from  'axios'
const state = {
    users:null
};
const getters = {
    allUsers:(state) =>state.users
};
const actions = {
    async fetchUsers({commit}){
        const response = await axios.post('api/user-list');
        commit('setUsers',response.data);
    },
    async addUser({commit},title){
        const response = await axios.post('https://jsonplaceholder.typicode.com/users',{title,completed:false});
        commit('newUser',response.data);
    },
    async removeUser({commit},id){
        await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
        commit('deleteUser',id);
    },
    async filterUser({commit},e){
        const limit = parseInt(e.target.options[e.target.options.selectedIndex].innerText);
        const response = await axios.get(`https://jsonplaceholder.typicode.com/users?_limit=${limit}`);
        commit('setUsers',response.data);
    },
    async isCompleteUser({commit},id){
        commit('markUser',id);
    }
};
const mutations = {
    setUsers:function(state,users){
        return state.users = users
    },
    newUser:(state,users)=>state.users.unshift(users),
    deleteUser:(state,id)=>state.users.splice(id,1),
    markUser:(state,id)=>state.users[id].completed = !state.users[id].completed,
};
export default {
    state,
    getters,
    actions,
    mutations,
}