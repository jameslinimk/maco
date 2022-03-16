import type { GuildMember } from "discord.js"
import { formatMoney, random } from "../../../../ts/globalFunctions.js"

interface Event {
	/**
	 * Amount of money the user will get
	 */
	money: [number, number]
	/**
	 * Probability of this item being selected
	 */
	weight: number
	/**
	 * Custom variables:
	 *  - `{user}` | Username
	 *  - `{tag}` | Tag
	 *  - `{mention}` | Mention
	 *  - `{money}` | Amount of money gotten
	 *  - `{-money}` | Amount of money gotten but * -1
	 *  - `{person}` | A random person
	 *  - `{place}` | A random place
	 */
	messages: string[]
}

const randomPlaces = [
	"McDonalds",
	"your moms house",
	"your dads house",
	"the White House",
	"Subway",
	"Wendys",
	"Taco Bell",
	"CVS",
	"Wallgreens",
	"Joes Bagels",
	"Joes Juices",
	"Joes Pizza",
	"Joes house",
	"Home Depot",
	"Lowes",
	"Walmart",
	"Target",
	"Starbucks",
	"School",
	"your cousins house",
	"your uncles house",
	"your local drug dealers house",
	"Statue of Liberty",
	"Central Park",
	"Empire State Building",
	"the Blue House",
	"the Twin Towers",
	"Broadway",
	"Times Square",
	"Trump Tower",
	"the MET",
	"the Golden State Bridge",
	"the Brooklyn State Bridge",
	"Chick Fil A",
	"Jamba Juice",
	"Joe the Juice",
	"Einstein Bros. Bagels",
	"Shake Shack",
	"Chipotle",
	"a Wingstop",
	"a Whataburger",
	"Burger King",
	"Hungry Jacks",
	"a Carl's JR",
	"a Jack in the Box",
	"a Texas Roadhouse",
	"a Outhouse Steakhouse",
	"a Longhorn Steakhouse",
	"a Nathans Famous ",
	"an In-N-Out",
	"a Auntie Annies",
	"a Hardee's",
	"a Duane Reade",
	"Work",
	"Home"
]

const randomPeople = [
	"Joe Biden",
	"Donald Trump",
	"your mom",
	"your dad",
	"your sister",
	"your brother",
	"dream",
	"a dream stan",
	"bob",
	"Rasputin",
	"Opera",
	"Beyoncé",
	"Dwayne Johnson",
	"the Rock",
	"John Cena",
	"Zhong Xina",
	"Will Smith",
	"Jaden Smith",
	"Eminem",
	"Robert Downy Jr.",
	"Justin Bieber",
	"Barack Obama",
	"Jeff Bezos",
	"Elon Musk",
	"Mark Zuckerberg",
	"Isaac Newton",
	"Jesus",
	"God",
	"the Buddha",
	"Taylor Swift",
	"Selena Gomez",
	"Kendall Jenner",
	"Madonna",
	"Gandhi",
	"Logan Paul",
	"Jake Paul",
	"Conner McGregor",
	"Floyd Mayweather",
	"Tom Brady",
	"Holdin Tudix",
	"Ray Piste",
	"Justin Hurass",
	"Ben Dover",
	"Confucius",
	"Christopher Columbus",
	"Albert Einstein",
	"Xi Jinping",
	"Mao Zedong",
	"Genghis Khan",
	"Shakespeare",
	"Aristotle",
	"Napoleon"
]

const events: Event[] = [
	{
		money: [ 5, 20 ],
		weight: 10,
		messages: [
			"{user} found {money} while going on a walk.",
			"While walking back from {place}, {user} found {money}",
			"{user} stole {money} from a {person}'s purse",
			"While walking back from {place}, {user} robbed {person} for {money}",
			"While in {place}, {user} killed {person} and stole {money}",
			"{user} took pictures of {person}'s feet for {money}",
			"{user} stole {money} from a homeless guy",
			"{user} sold his kidneys for {money}",
			"{user} flipped his NFTs for {money}",
			"{user} screenshotted {person}'s NFTs for {money}",
			"{user} hacked {place} for {money}",
			"{user} assassinated {person} for {money}",
			"{user} punched {person} for {money}",
			"{user} stole {money} from {person} in Bitcoin",
			"{user} scammed {person} for {money}"
		]
	},
	{
		money: [ -5, -10 ],
		weight: 1,
		messages: [
			"Unlucky, {user} tripped and {-money} fell out of his pocket",
			"Unlucky, {user} was caught lifting a shop and was fined {-money}",
			"Unlucky, {user} was caught shoplifting and was fined {-money}",
			"Unlucky, {user} was caught j-walking and was fined {-money}",
			"Unlucky, {person} screenshotted {user}'s NFTs and {user} lost {-money}",
			"Unlucky, the stock market crashed and {user} lost {-money}",
			"Unlucky, {user} was fired from his job and lost {-money}"
		]
	},
	{
		money: [ 1000, 2000 ],
		weight: 0.01,
		messages: [
			"💵 !JACKPOT! 💵 {user} teamed up to rob the biggest bank in town and got {money}!",
			"🎰 !JACKPOT! 🎰 {user} purchased and won the lottery for {money}!",
			"⚽ !JACKPOT! ⚽ {user} won a national soccer tournament for {money}!"
		]
	}
]

const randomEvent = () => {
	const threshold = Math.random() * events.reduce((acc, cur) => acc += cur.weight, 0)

	let total = 0
	for (let i = 0; i < events.length - 1; ++i) {
		total += events[i].weight
		if (total >= threshold) return events[i]
	}

	return events[events.length - 1]
}

const parseEvent = (event: Event, user: GuildMember) => {
	const money = random(event.money[0], event.money[1])
	const message = event.messages[Math.floor(Math.random() * event.messages.length)]
		.replaceAll("{user}", `*${user.displayName}*`)
		.replaceAll("{tag}", `${user.user.tag}`)
		.replaceAll("{mention}", `${user}`)
		.replaceAll("{money}", formatMoney(money))
		.replaceAll("{-money}", formatMoney(-money))
		.replaceAll("{place}", `*${randomPlaces[Math.floor(Math.random() * randomPlaces.length)]}*`)
		.replaceAll("{person}", `*${randomPeople[Math.floor(Math.random() * randomPeople.length)]}*`)

	return { message, money }
}

// const test = () => {
// 	const messages = {}
// 	for (let i = 0; i < 100000; i++) {
// 		const event = randomEvent()
// 		if (!messages[event.messages[0]]) messages[event.messages[0]] = 0
// 		messages[event.messages[0]] += 1
// 	}
// 	console.log(messages)
// }
// test()

export {
	events,
	randomEvent,
	parseEvent
}

