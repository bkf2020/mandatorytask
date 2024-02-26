import { signIn, signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

import { api } from "~/utils/api";
import { toast, Toaster } from "react-hot-toast";

export function AddTaskForm() {
  const { data:sessionData, status } = useSession();
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const ctx = api.useContext();

  const { mutate } = api.task.create.useMutation({
    onSuccess: () => {
      setDesc("");
      setDate("");
      void ctx.task.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
    },
});

  if (status !== "authenticated") return null;

  return (
    <div className="sm:flex">
        <input onChange={(e) => setDesc(e.target.value)} placeholder="Enter task description" type="text" value={desc} className="py-3 px-4 pe-11 block w-full border-t border-neutral-200 -mt-px -ms-px last:rounded-b-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 placeholder-neutral-500 dark:text-neutral-400 dark:placeholder-neutral-400 dark:focus:ring-neutral-600" />
        <input onChange={(e) => setDate(e.target.value)} type="datetime-local" value={date} className="py-3 px-4 pe-11 block w-full border-t border-l border-neutral-200 -mt-px -ms-px last:rounded-b-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600" />
        <button disabled={desc === "" || date === ""} onClick={() => mutate({ desc: desc, dueDate: new Date(date) })} className="py-3 px-4 text-sm sm:w-1/4 w-full font-semibold border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-neutral-600">
          Add
        </button>
    </div>
  )
}

export function Timer() {
  let endTime : Date = new Date(Date.now());
  let intervalId : any;
  const [duration, setDuration] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  function CountDown() {
    setRunning(true);
    let secondsLeft = ((endTime.getTime() - Date.now()) - (endTime.getTime() - Date.now()) % 1000 + 1000) / 1000;
    let minutesLeft = (secondsLeft - secondsLeft % 60) / 60;
    secondsLeft %= 60;
    let hoursLeft = (minutesLeft - minutesLeft % 60) / 60;
    minutesLeft %= 60;
    setHours(hoursLeft);
    setMinutes(minutesLeft);
    setSeconds(secondsLeft);
    if (Date.now() >= endTime.getTime()) {
      setHours(0);
      setMinutes(0);
      setSeconds(0);
      setRunning(false);
      clearInterval(intervalId);
    }
  }

  return (
    <div className="flex flex-col bg-white border border-neutral-200 shadow-sm rounded-xl p-4 md:p-5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutrals-300">
        <h2 className="text-xl pb-2">Timer for work/break session</h2>
        <h2 className="text-3xl text-center pb-2s">{hours}<span id="hours" className="text-xl">h</span> {minutes}<span id="min" className="text-xl">m</span> {seconds}<span id="sec"className="text-xl">s</span></h2>
        <div className="text-center">
          <input type="number" onChange={(e) => setDuration(e.target.valueAsNumber)} min="1" className="py-2 px-3 w-full max-w-60 my-2 border border-neutral-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-400 placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Enter number of minutes" />
          <button type="button" disabled={running}
            onClick={() => {
              if (!running) {
                endTime = new Date(Date.now() + duration * 1000 * 60);
                intervalId = setInterval(CountDown, 250);
              }}}
            className="mx-2 py-2 px-3 w-16 text-center text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-neutral-600">
            Start
          </button>
        </div>
    </div>
  );
}

export function SetPunishmentForm() {
  const { data:sessionData, status } = useSession();
  const [name, setName] = useState("");
  const [recipient, setRecipient] = useState("");
  const ctx = api.useContext();

  const { data: punishment, status: data } = api.punishment.getAll.useQuery();
  useEffect(() => {
    if (punishment?.userName != null && punishment?.recipient != null) {
      setName(punishment.userName);
      setRecipient(punishment.recipient);
    }
  }, [data])

  const { mutate } = api.punishment.create.useMutation({
    onSuccess: () => {
      toast.success("Information for punishment updated successfully!");
      void ctx.punishment.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.recipient;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
    },
  });

  if (status !== "authenticated") return null;

  const { mutate : mutateUpdate } = api.punishment.update.useMutation({
    onSuccess: () => {
      toast.success("Information for punishment updated successfully!");
      void ctx.punishment.getAll.invalidate();
    },
    onError: (e) => {
      console.log(e.data);
      const errorMessage = e.data?.zodError?.fieldErrors.recipient;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
    },
  });

  return (
    <div className="mb-2 bg-white border border-neutral-200 shadow-sm rounded-xl p-4 md:p-5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutrals-300">
      <h2 className="text-lg">Enter your information for the punishment</h2>
      <p className="text-sm my-1">Type the name that will appear on the email and the email of the person to notify (the recipient).</p>
        <input onChange={(e) => setName(e.target.value)} placeholder="Enter your name" type="text" value={name} className="py-2 mr-2 px-3 w-full max-w-60 my-1 border border-neutral-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-400 placeholder-neutral-500 dark:focus:ring-neutral-600" />
        <input onChange={(e) => setRecipient(e.target.value)} type="text" placeholder="Enter email of recipient" value={recipient} className="py-2 mr-2 px-3 w-full max-w-60 my-2 border border-neutral-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-400 placeholder-neutral-500 dark:focus:ring-neutral-600" />
        {punishment != null
          ? <button disabled={name === "" || recipient === ""} onClick={() => mutateUpdate({ id: punishment.id, name: name, recipient: recipient })} className="py-2 px-3 w-16 text-center text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-neutral-600">
            Set
          </button>
          : <button disabled={name === "" || recipient === ""} onClick={() => mutate({ name: name, recipient: recipient })} className="py-2 px-3 w-16 text-center text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-neutral-600">
            Set
          </button>
        }
        
    </div>
  )
}

export default function Dashboard() {
  const { data:sessionData, status } = useSession();
  const { data: tasks } = api.task.getAll.useQuery();
  const ctx = api.useContext();
  const { mutate } = api.task.setFinished.useMutation({
    onSuccess: () => {
      ctx.task.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
    },
  });

  if (status !== "authenticated") {
    return (
      <>
        <Head>
          <title>Dashboard - mandatorytask</title>
          <meta name="description" content="Generated by create-t3-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="min-h-screen text-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
          <div className="max-w-screen-md mx-auto">
            Please sign in to use the dashboard
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - mandatorytask</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="test.css" key="test"/>
      </Head>
      <main className="min-h-screen text-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
        <header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white text-sm pt-3 pb-2 dark:bg-neutral-900">
          <nav className="max-w-screen-md w-11/12 mx-auto sm:flex sm:items-center sm:justify-between border-b pb-1 dark:border-neutral-600" aria-label="Global">
            <a className="flex-none text-xl font-semibold dark:text-neutral-200" href="#">Mandatorytask</a>
            <div className="flex flex-row items-center gap-5 mt-3 sm:justify-end sm:mt-0 sm:ps-5">
              <a className="font-medium text-blue-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href="https://github.com/bkf2020/mandatorytask" rel="noopener noreferer" target="_blank" aria-current="page">GitHub</a>
              <button className="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" onClick={() => signOut({ callbackUrl: '/' })}>Sign out</button>
            </div>
          </nav>
        </header>
        <div className="w-11/12 max-w-screen-md mx-auto pb-2">
          <div><Toaster/></div>
            <div className="mb-3">
              <p className="text-sm">Type tasks with due dates. If you do not finish the task by the due date, an email will be sent to the person you want
              telling them that you didn't finish on time. Note that due dates are displayed based on the time/localization set on your device.
              </p>
            </div>

            <SetPunishmentForm></SetPunishmentForm>
            <Timer />

            <div className="flex flex-col py-2">
                <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                    <div className="border rounded-lg overflow-hidden dark:border-neutral-700">
                        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                        <thead>
                            <tr>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-neutral-500 uppercase">Task</th>
                            <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-neutral-500 uppercase">Due Date</th>
                            <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-neutral-500 uppercase">Finish Task</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                            {tasks?.map((task) => (
                              [
                                <tr>
                                  <td className="px-6 py-4 max-[640px]:whitespace-nowrap text-sm font-medium text-neutral-800 dark:text-neutral-300">{task.desc}</td>
                                  <td className="px-6 py-4 max-[640px]:whitespace-nowrap text-end text-sm text-neutral-800 dark:text-neutral-300">{task.dueDate.toLocaleString()}</td>
                                  <td className="px-6 py-4 max-[640px]:whitespace-nowrap text-end text-sm font-medium">
                                    <button type="button" onClick={() => mutate({ id: task.id })} className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-neutral-600">Finish</button>
                                  </td>
                                </tr>
                              ]
                            ))}
                        </tbody>
                        </table>
                        <AddTaskForm />
                    </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </>
  );
}