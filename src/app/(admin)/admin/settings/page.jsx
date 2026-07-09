"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function page() {

  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);


  const fetchSettings = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/settings");

      if (data.success) {

        // API returns single object
        // convert into array for table
        if(data.data){
          setSettings([data.data]);
        }else{
          setSettings([]);
        }

      } else {
        toast.error(data.message);
      }

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to fetch settings."
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchSettings();
  }, []);



  const deleteSetting = async (id) => {

    if(!confirm("Delete this setting?")) return;


    try {

      const {data} = await axios.delete(
        `/api/settings/${id}`
      );


      if(data.success){

        toast.success(data.message);
        fetchSettings();

      }else{

        toast.error(data.message);

      }


    } catch(error){

      toast.error(
        error.response?.data?.message ||
        "Unable to delete setting."
      );

    }

  };



  return (

    <div className="p-6">


       <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Settings
          </h1>

          <p className="text-gray-500">
            Manage your institute's settings.
          </p>
        </div>

        <Link
          href="/admin/settings/create"
          className="rounded-lg bg-[#0F5E8C] px-5 py-3 text-white hover:bg-sky-700"
        >
          + Add Setting
        </Link>
      </div>



      <div className="bg-white rounded-xl shadow overflow-x-auto">


        {
          loading ?

          <div className="p-10 text-center">
            Loading...
          </div>


          :


          <table className="w-full">


            <thead className="bg-gray-100">

              <tr>

                <th className="p-3 text-left">
                  Logo
                </th>

                <th className="p-3 text-left">
                  Site Name
                </th>

                <th className="p-3 text-left">
                  Email
                </th>

                <th className="p-3 text-left">
                  Phone
                </th>

                <th className="p-3 text-left">
                  Maintenance
                </th>

                <th className="p-3 text-left">
                  Action
                </th>


              </tr>

            </thead>



            <tbody>


            {
              settings.length > 0 ?

              settings.map((setting)=>(


                <tr 
                key={setting._id}
                className="border-t border-gray-200"
                >


                  <td className="p-3">


                    {
                      setting.logo ?

                      <img
                      src={setting.logo}
                      alt="logo"
                      className="w-14 h-14 rounded object-cover"
                      />

                      :

                      <div className="w-14 h-14 bg-gray-100 rounded flex items-center justify-center">
                        N/A
                      </div>

                    }


                  </td>



                  <td className="p-3">

                    <p className="font-semibold">
                      {setting.siteName}
                    </p>

                    <p className="text-sm text-gray-500">
                      {setting.siteTitle}
                    </p>

                  </td>




                  <td className="p-3">
                    {setting.email}
                  </td>




                  <td className="p-3">
                    {setting.phone}
                  </td>




                  <td className="p-3">

                    {
                      setting.maintenanceMode ?

                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
                        ON
                      </span>

                      :

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        OFF
                      </span>
                    }

                  </td>




                  <td className="p-3">

                    <div className="flex gap-2">


                      <Link
                      href={`/admin/settings/edit/${setting._id}`}
                      className="bg-yellow-500 text-white p-2 rounded"
                      >
                        <Pencil size={16}/>
                      </Link>



                      <button
                      onClick={()=>deleteSetting(setting._id)}
                      className="bg-red-600 text-white p-2 rounded"
                      >

                        <Trash2 size={16}/>

                      </button>


                    </div>


                  </td>



                </tr>


              ))



              :


              <tr>

                <td
                colSpan="6"
                className="text-center p-8"
                >
                  No settings found
                </td>

              </tr>

            }



            </tbody>


          </table>


        }


      </div>


    </div>

  );

}