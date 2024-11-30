import {useRouter, useRoute} from 'vue-router'

export function useQueryManager(){
    const router = useRouter()
    const route = useRoute()

    async function clearQueryParams(params){
        const newQuery = {...route.query}

        if(Array.isArray(params)){
            params.forEach(p=>delete newQuery[p])
        }else{
            delete newQuery[params]
        }

        await router.push({query: newQuery})
    }

    async function replaceQueryParams(param_name, params){
        await router.push({
            query:{
                ...route.query,
                [param_name]: params
            }
        })
    }

    // function replaceQueryParams(params){
    //     router.push({query: params})
    // }

    return {clearQueryParams, replaceQueryParams}
}