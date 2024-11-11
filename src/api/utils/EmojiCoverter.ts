import { toArray } from "lodash";
import * as Emoji from "node-emoji";
import { Service } from "typedi";
import { format } from "util";

@Service()
export class EmojiConverter {
    public fromText(str: string): string {
        if (!str) { 
            return ''; 
        }
        if (!Emoji.hasEmoji(str)) {
            return str;
        }

        let words = toArray(str);
        return words.map((word) => {
          const emojiCode = Emoji.which(word);
          return emojiCode ? this.convertToWemoji(emojiCode) : word;
        }).join('');
    }

    private convertToWemoji(emojiCode: string): string {
        return format('<span class="emoji emoji-%s">%s</span>', emojiCode, emojiCode);
    }
}
