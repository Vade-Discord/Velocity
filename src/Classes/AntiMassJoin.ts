import { Member, User } from 'eris';
import { Bot } from "../Client/Client";
import AutoMod from "./AutoMod";

export class AntiMassJoin extends AutoMod {

    public joinBuckets = new Map<string, JoinBucket>();

    public resetMemberTimer?: NodeJS.Timer;

    public async run(guild, member: Member) {

        this._resetMembers();


        const existingBucket = this.joinBuckets.get(member.guild.id) ?? {
            lockdown: false,
            members: []
        };

        const bucket = {
            ...existingBucket,
            members: [
                ...existingBucket.members,
                {
                    user: member.user,
                    createdAt: member.createdAt,
                    joinedAt: member.joinedAt ?? new Date()
                }
            ]
        };
        // @ts-ignore
        this.joinBuckets.set(member.guild.id, bucket);
        if (bucket.lockdown) {
          await this.client.automod.AutoAction(guild.id, member, 'massJoin');
            // Reset the lockdown timer if someone joins
            bucket.lockdownTimeout?.refresh();

            return true;
        }

        const joins = bucket.members.length;

        if (joins >= this.client.config.PRIVATE.join_threshold) {
            bucket.lockdown = true;
            bucket.lockdownTimeout = setTimeout(
                () => this.joinBuckets.delete(member.guild.id),
                this.client.config.PRIVATE.join_threshold_time
            );

            while (bucket.members.length) {
                const banMember = bucket.members.shift();
                if (!banMember) break;
                // @ts-ignore
               await this.client.automod.AutoAction(guild.id, banMember, 'massJoin');
            }

            this.joinBuckets.set(member.guild.id, { ...bucket, members: [] });
        }

        return false;

        }

    private _resetMembers() {
        if (this.resetMemberTimer) return;

        this.resetMemberTimer = setInterval(() => {
            for (const [guildId, bucket] of this.joinBuckets) {
                this.joinBuckets.set(guildId, {
                    ...bucket,
                    members: bucket.members.filter(
                        (member) =>
                            Date.now() - member.joinedAt.getTime() < this.client.config.PRIVATE.join_threshold
                    )
                });
            }
        }, 5000);
    }

}

export interface JoinBucket {
    lockdown: boolean;
    lockdownTimeout?: NodeJS.Timeout;
    members: MemberJoin[];
}

export interface MemberJoin {
    user: User;
    createdAt: Date;
    joinedAt: Date;
}