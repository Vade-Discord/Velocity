import { Message } from 'eris';
import phin from 'phin';
import AutoMod from './AutoMod';

interface result {
    link: string;
    status: boolean;
}

interface match {
    domain: string;
    source: string;
    traversed: boolean;
    acccuracy: number;
}

export class AntiPhishing extends AutoMod {

  async Run(message: Message,): Promise<result> {
    const API_KEY = this.client.config.API.PHISHING;
    const content = message?.content;
    const regex = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/;
    if(content.match(regex)) {
      const response = await phin<{ match: boolean, matches: match[] }>( {
        url: 'https://phishing.t3ned.dev/api/v1/check',
        parse: 'json',
        headers: {
          'authorization': `Bearer ${API_KEY}`,
        },
        data: {
          'content': `${content}`,
        }
      });
      if(response?.body.match) {
        message.delete('Detected Phishing Link').catch(() => null);
        return {
          status: true,
          link: response.body.matches[0].domain
        };
      }
    } else {
      return {
        status: false,
        link: null,
      };
    }



  }
}