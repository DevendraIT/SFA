import {
    FiUsers,
    FiUserCheck,
    FiUserX,
    FiMapPin
} from "react-icons/fi";

const stats = [

    {
        title:"Total Customers",
        value:"1250",
        icon:<FiUsers size={28}/>,
        color:"bg-blue-500"
    },

    {
        title:"Active Customers",
        value:"1180",
        icon:<FiUserCheck size={28}/>,
        color:"bg-green-500"
    },

    {
        title:"Inactive",
        value:"70",
        icon:<FiUserX size={28}/>,
        color:"bg-red-500"
    },

    {
        title:"Today's Visits",
        value:"18",
        icon:<FiMapPin size={28}/>,
        color:"bg-orange-500"
    }

];

export default function CustomerStats(){

return(

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

{
stats.map((item,index)=>(

<div
key={index}
className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition">

<div className="flex justify-between">

<div>

<p className="text-gray-500">

{item.title}

</p>

<h2 className="text-3xl font-bold mt-3">

{item.value}

</h2>

</div>

<div className={`${item.color} w-14 h-14 rounded-xl flex justify-center items-center text-white`}>

{item.icon}

</div>

</div>

</div>

))
}

</div>

)

}